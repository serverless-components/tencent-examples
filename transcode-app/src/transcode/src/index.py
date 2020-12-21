# -*- coding: utf-8 -*-

import re
import os
import time
import json
import logging
import datetime
import traceback
import subprocess
import threading

from qcloud_cos_v5 import CosConfig
from qcloud_cos_v5 import CosS3Client

# 控制log输出级别
logger = logging.getLogger()
logger.setLevel(logging.INFO)


# 时间字符串转毫秒
def time_to_num(time_str):
    h, m, s = time_str.split(':')
    return (float(h) * 60 * 60 + float(m) * 60 + float(s)) * 1000


def file_upload_ffmpeg_task(proc, base_info):
    cos_client = base_info['cos_client']

    bucket = base_info['dst_bucket']
    key = base_info['dst_path'] + '/' + base_info['upload_name']
    part_number = 1
    part_list = []
    read_limit = base_info['read_limit']
    upload_size = base_info['upload_size']
    small_block_buffer = b''

    # 打开fifo读端
    fifo_rf = os.open(base_info['fifo_path'], os.O_RDONLY)

    # 创建分块上传
    init_resp = cos_client.create_multipart_upload(
        Bucket=bucket,
        Key=key
    )

    upload_id = init_resp['UploadId']

    logger.info({
        'task': 'UPLOAD TASK',
        'type': 'init',
        'time_stamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'detail': init_resp
    })

    while True:
        try:
            temp_block = os.read(fifo_rf, read_limit)

            if temp_block:
                # 如果buffer存在数据
                # 则将temp_block追加到buffer尾部
                if len(small_block_buffer) > 0:
                    small_block_buffer += temp_block
                    # buffer中的数据到达可上传大小
                    # 则启动分块上传
                    if len(small_block_buffer) >= upload_size:
                        upload_resp = cos_client.upload_part(
                            Bucket=bucket,
                            Key=key,
                            Body=small_block_buffer,
                            PartNumber=part_number,
                            UploadId=upload_id
                        )

                        part_list.append(
                            {
                                'ETag': upload_resp['ETag'],
                                'PartNumber': part_number
                            }
                        )

                        part_number += 1
                        small_block_buffer = b''

                        logger.info({
                            'task': 'UPLOAD TASK',
                            'type': 'uploading',
                            'time_stamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'detail': upload_resp
                        })

                # 如果buffer中的无数据
                # 则将temp_block写入buffer
                # 但不先不进行上传
                elif len(small_block_buffer) == 0:
                    small_block_buffer = temp_block

            else:
                # 确保剩余分块上传
                if len(small_block_buffer) > 0:
                    upload_resp = cos_client.upload_part(
                        Bucket=bucket,
                        Key=key,
                        Body=small_block_buffer,
                        PartNumber=part_number,
                        UploadId=upload_id
                    )

                    part_list.append(
                        {
                            'ETag': upload_resp['ETag'],
                            'PartNumber': part_number
                        }
                    )
                    part_number += 1
                    small_block_buffer = b''
                    logger.info({
                        'task': 'UPLOAD TASK',
                        'type': 'uploading',
                        'time_stamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                        'detail': upload_resp
                    })

                # 完成分块上传
                end_resp = cos_client.complete_multipart_upload(
                    Bucket=bucket,
                    Key=key,
                    UploadId=upload_id,
                    MultipartUpload={'Part': part_list}
                )

                logger.info({
                    'task': 'UPLOAD TASK',
                    'type': 'end',
                    'time_stamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'detail': end_resp
                })

                break

        except Exception as e:
            print(traceback.format_exc())
            # 如果上传过程中异常, 强制关闭fifo_rf
            # 预期会在ffmpeg中抛出Broken pipe
            os.close(fifo_rf)
            break

    return


def log_ffmpeg_task(proc, base_info):
    task_begin = time.time()
    # sub_proc_success = 0
    # sub_proc_fail = 1
    result_map = {
        0: 'ffmpeg task success',
        1: 'ffmpeg task failed'
    }
    report_time = 60.0
    cur_duration = r'time=(?P<t>\S+)'
    duration = r'Duration: (?P<t>\S+)'

    log_index = base_info['key'].split('/')[-1] + '-' + base_info['date_tag']
    ffmpeg_debug = base_info['ffmpeg_debug']
    file = base_info['upload_name'],
    size = str(round(base_info['size'] / 1024 / 1024, 2)) + 'M',
    transcode_format = base_info['dst_format'],
    ffmpeg_output = []

    fifo_wf_when_ffmpeg_close = os.open(base_info['fifo_path'], os.O_WRONLY)

    ffmpeg_proc_info = {
        'input_vedio_time': 0.0,
        'schedule_cursor': 0.0,
        'time_cursor': task_begin
    }

    logger.info({
        'task': 'LOG TASK',
        'index_group': log_index,
        'type': 'init',
        'time_stamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'file': file,
        'size': size,
        'transcode_format': transcode_format
    })

    while True:
        o_pipe = proc.stderr.readline().strip()

        if o_pipe:
            ffmpeg_output.append(o_pipe)
            total_time = re.search(duration, o_pipe)
            if total_time:
                total_time = total_time.groupdict()['t'].replace(',', '')
                ffmpeg_proc_info['input_vedio_time'] = time_to_num(total_time)

            cur_time = re.search(cur_duration, o_pipe)
            if cur_time:
                try:
                    cur_time = cur_time.groupdict()['t']
                    incoding_vedio_time = time_to_num(cur_time)

                    # 小数点后2位进1
                    transcode_percent = round(
                        (incoding_vedio_time / ffmpeg_proc_info['input_vedio_time']) * 100, 1)

                    if transcode_percent > 100.0:
                        transcode_percent = 100.0

                    # 转码进度每10%, 则上报进度信息
                    temp_schedule_cursor = transcode_percent // 10
                    if temp_schedule_cursor > ffmpeg_proc_info['schedule_cursor']:
                        ffmpeg_proc_info['schedule_cursor'] = temp_schedule_cursor
                        transcode_percent = str(transcode_percent) + '%'
                        logger.info({
                            'task': 'LOG TASK',
                            'index_group': log_index,
                            'type': 'running',
                            'time_stamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'file': file,
                            'size': size,
                            'transcode_format': transcode_format,
                            'transcode_percent': transcode_percent
                        })

                        continue
                    # 如转码进度未新增10%
                    # 则每隔60s并且在转码进程有输出的情况下, 上报进度
                    cur_time_cursor = time.time()
                    if cur_time_cursor - \
                            ffmpeg_proc_info['time_cursor'] >= report_time:
                        ffmpeg_proc_info['time_cursor'] = cur_time_cursor
                        transcode_percent = str(transcode_percent) + '%'
                        logger.info({
                            'task': 'LOG TASK',
                            'index_group': log_index,
                            'type': 'running',
                            'time_stamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                            'file': file,
                            'size': size,
                            'transcode_format': transcode_format,
                            'transcode_percent': transcode_percent
                        })

                        continue

                except Exception as e:
                    pass

        # 读取到EOF
        else:
            break

    # 确认转码进程结束
    while proc.poll() is None:
        time.sleep(2)
    else:
        # 手动关闭wf，这样在文件上传线程中，rf可读取到EOF
        os.close(fifo_wf_when_ffmpeg_close)

    task_end = time.time()
    transcode_cost_time = str(round(task_end - task_begin, 1)) + 's'

    transcode_success = result_map[proc.poll()]
    logger.info({
        'task': 'LOG TASK',
        'index_group': log_index,
        'type': 'end',
        'time_stamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'file': file,
        'size': size,
        'transcode_format': transcode_format,
        'transcode_cost_time': transcode_cost_time,
        'transcode_success': transcode_success
    })

    # 分块的输出ffmpeg执行日志
    # 这里可以通过环境变量ffmpeg_debug的配置关闭日志输出
    if int(ffmpeg_debug) == 1:
        ffmpeg_output_log_len = 30
        if len(ffmpeg_output) > 0:
            len_of_outputs = len(ffmpeg_output)
            index_cursor = 0
            while index_cursor != -1:
                if index_cursor + ffmpeg_output_log_len <= len_of_outputs - 1:
                    index_end = index_cursor + ffmpeg_output_log_len
                else:
                    index_end = -1
                real_output = ffmpeg_output[index_cursor:index_end]
                if len(real_output) > 0:
                    logger.info({
                        'task': 'LOG TASK',
                        'index_group': log_index,
                        'type': 'end',
                        'file': file,
                        'size': size,
                        'ffmpeg_log': real_output,
                    })
                index_cursor = index_end
    return


def main_handler(event, context):
    logger.info(json.dumps(event))

    # 为了适配windows端用户
    # 将ffmeg文件复制到/tmp下并赋予执行权限
    subprocess.run(
        'cp ./ffmpeg /tmp/ffmpeg && chmod 755 /tmp/ffmpeg',
        shell=True)

    region = os.environ.get('REGION')  # 输出桶所在地域
    dst_bucket = os.environ.get('DST_BUCKET')  # 输出桶名称
    dst_path = os.environ.get('DST_PATH')  # 输出桶目录
    dst_format = os.environ.get('DST_FORMAT')  # 转码格式
    cmd_origin = '/tmp/' + os.environ.get('FFMPEG_CMD')  # ffmpeg命令
    secret_id = os.environ.get('TENCENTCLOUD_SECRETID')
    secret_key = os.environ.get('TENCENTCLOUD_SECRETKEY')
    token = os.environ.get('TENCENTCLOUD_SESSIONTOKEN')
    ffmpeg_debug = os.environ.get(
        'FFMPEG_DEBUG',
        1)   # 是否输出ffmpeg日志, 1为输出 0为不输出
    read_limit = 1024 * 64  # 一次性读取多少输出数据(单位: byte),建议使用默认值即可,默认为64KB
    # 分块上传一次性最多上传多少数据(单位: byte),建议使用默认值即可,默认为10MB
    upload_size = 1024 * 1024 * 10

    if "Records" in event.keys():
        base_info = {}

        date = datetime.datetime.now()
        date_tag = date.strftime('%Y%m%d%H%M%S')

        cos_client = CosS3Client(CosConfig(Region=region,
                                           SecretId=secret_id,
                                           SecretKey=secret_key,
                                           Token=token))

        key = "/".join(event['Records'][0]['cos']
                       ['cosObject']['key'].split("/")[3:])

        # 生成输入文件的预签名
        # cos sdk无token签名，因此这里需要手动拼接token
        download_input = cos_client.get_presigned_download_url(
            Bucket=dst_bucket,
            Key=key,
            Expired=60 * 60 * 12,
        )
        download_input += '&x-cos-security-token={token}'.format(
            token=token)

        output_name = key.split('/')[-1].split('.')[0] + '.' + dst_format
        file_name, file_format = output_name.split('.')
        upload_name = '{file_name}-{date_tag}.{file_format}'.format(
            file_name=file_name, date_tag=date_tag, file_format=file_format)

        # 创建fifo
        fifo_path = '/tmp/fifo' + str(int(time.time()))
        os.mkfifo(fifo_path)

        cmd = cmd_origin.format(
            input=download_input,
            dst_format=dst_format,
            output=fifo_path)
        cmd_list = cmd.split(' ')

        # 日志上报与文件上传线程使用的一些公共参数
        base_info['cos_client'] = cos_client
        base_info['region'] = region
        base_info['dst_format'] = dst_format
        base_info['dst_bucket'] = dst_bucket
        base_info['dst_path'] = dst_path
        base_info['ffmpeg_debug'] = ffmpeg_debug

        base_info['size'] = event['Records'][0]['cos']['cosObject']['size']
        base_info['key'] = key
        base_info['upload_name'] = upload_name
        base_info['date_tag'] = date_tag
        base_info['fifo_path'] = fifo_path

        base_info['upload_size'] = upload_size
        base_info['read_limit'] = read_limit

    else:
        raise Exception('event does not come from COS')

    try:
        # 转码进程启动
        proc = subprocess.Popen(
            cmd_list, stderr=subprocess.PIPE, universal_newlines=True)

        # 创建文件上传线程
        task_list = []
        cos_upload_task = threading.Thread(target=file_upload_ffmpeg_task,
                                           args=(proc, base_info))

        # 创建日志输出线程
        task_list.append(cos_upload_task)
        log_upload_task = threading.Thread(target=log_ffmpeg_task,
                                           args=(proc, base_info))
        task_list.append(log_upload_task)

        # 启动线程
        for task in task_list:
            task.start()

        # 等待线程结束
        for task in task_list:
            task.join()

    except Exception as e:
        print(traceback.format_exc())

    finally:
        # 显式删除fifo
        if os.path.exists(fifo_path):
            os.remove(fifo_path)
        # 显式删除/tmp下的ffmpeg可执行文件
        if os.path.exists('/tmp/ffmpeg'):
            os.remove('/tmp/ffmpeg')

    return {
        'code': 200,
        'Msg': 'success'
    }
