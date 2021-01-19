## 应用简介
使用COS+云函数+CLS+FFmpeg，快速构建高可用、并行处理、实时日志、高度自定义视频转码服务。

### 架构原理

通过云函数创建ffmpeg任务进程，云函数进程与ffmpeg任务进程通过pipe和fifo的方式进行数据传输。云函数进程中的两个任务线程分别接收ffmpeg任务进程向函数进程输出的ffmpeg日志流与转码后的文件流。实时日志线程将日志流输出，上传任务负责缓存文件流并上传至用户定义的输出cos。 

![1608278445413](https://main.qcloudimg.com/raw/749ac11a39c98a1ffbf5bb6d4b758e5a.svg)

### 应用优势

1. 流式转码。采用流式拉取源视频文件，流式上传转码文件的工作方式，突破了本地存储的限制，且不需要额外部署cfs等产品。
2. 实时日志。视频转码过程中，可通过cls日志服务实时查看转码进度。同时支持输出ffmpeg应用的完整日志。
3. 长时运行。利用云函数的长时运行机制，支持12h-24h的运行时长，可覆盖大文件耗时较长的转码场景。
4. 自定义参数。支持用户自定义配置ffmpeg命令参数。

### 应用资源

 转码应用部署后，将为您创建以下资源：

- 云函数 ： 流式读取cos文件，使用ffmpeg转码后流式输出回cos中，并将转码过程的实时日志输出到cls。
- cls日志 ：存储转码过程的实时日志。cls日志可能会产生一定计费，详情参考[cls计费规则](https://cloud.tencent.com/document/product/614/47116)。

### 注意事项

1. 转码应用需要依赖云函数[长时运行](https://cloud.tencent.com/document/product/583/51519)能力。

2. 转码输出桶与函数建议配置在同一区域，因为跨区域配置转码应用稳定性及效率都会降低，并且会产生跨区流量费用。

3. 需要为转码应用的云函数创建运行角色，并授权cos读写权限。详细配置参考[运行角色](#运行角色)。

4. ffmpeg不同转码场景下指令配置参数不同，因此需要您具有一定的ffmpeg使用经验 。 本文中仅提供几个样例作为参考，更多ffmpeg指令参考[FFmpeg官网](https://ffmpeg.org/documentation.html)。


## 前提条件

1. [安装serverlesss framework](https://cloud.tencent.com/document/product/1154/42990)
3. 配置部署账号权限。参考 [账号和权限配置](https://cloud.tencent.com/document/product/1154/43006) 
4. 配置[运行角色](#运行角色)权限。

## 操作步骤
1. 下载转码应用。

   ```
   sls init transcode-app
   ```

2. 进入项目目录`transcode-app`，将看到目录结构如下：

   ```
   transcode-app
   |- .env  #环境配置
   |- serverless.yml # 应用配置
   |- log/ #log日志配置
   |  └── serverless.yml
   └──transcode/  #转码函数配置
      |- src/
      |   |- ffmpeg   #转码ffmpeg工具
      |   └── index.py
      └── serverless.yml
   
   ```

   a)  `log/serverless.yml` 定义一个cls日志集和主题，用于转码过程输出的日志保存，目前采用腾讯云cls日志存储。每个转码应用将会根据配置的cls日志集和主题去创建相关资源，cls的使用会产生计费，具体参考[cls计费规则](https://cloud.tencent.com/document/product/614/47116)。

   b)  `transcode/serverless.yml` 定义函数的基础配置及转码参数配置。

   c)  `transcode/src/index.py` 转码功能实现。

   d)   `transcode/src/ffmpeg` 转码工具ffmpeg。

3. 配置环境变量和应用参数

   a)  应用参数，文件`transcode-app/serverless.yml`

   ```
   #应用信息
   app: transcodeApp # 您需要配置成您的应用名称
   stage: dev # 环境名称，默认为dev
   ```

   a)  环境变量，文件`transcode-app/.env`

   ```
   REGION=ap-shanghai  # 应用创建所在区
   TENCENT_SECRET_ID=xxxxxxxxxxxx # 您的腾讯云sercretId
   TENCENT_SECRET_KEY=xxxxxxxxxxxx # 您的腾讯云sercretKey
   ```

   >?
   >
   >- 登陆腾讯云账号，可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 SecretId 和 SecretKey。
   >- 如果您的账号为主账号，或者子账号具有扫码权限，也可以不配置sercretId与sercretKey，直接扫码部署应用。更多详情参考[账号和权限配置](https://cloud.tencent.com/document/product/1154/43006)。

4. 配置转码需要的参数信息

   a)  cls日志定义，文件`transcode-app/log/serverless.yml`

   ```
   #组件信息 全量配置参考https://github.com/serverless-components/tencent-cls/blob/master/docs/configure.md
   component: cls # 引用 component 的名称
   name: cls-video # 创建的实例名称，请修改成您的实例名称
   
   #组件参数
   inputs:
     name: cls-log  # 您需要配置一个name，作为您的cls日志集名称
     topic: video-log # 您需要配置一个topic，作为您的cls日志主题名称
     region: ${env:REGION} # 区域，统一在环境变量中定义
     period: 7 # 日志保存时间，单位天
   ```

   b)  云函数及转码配置，文件`transcode-app/transcode/serverless.yml`   

   ```
   #组件信息 全量配置参考https://github.com/serverless-components/tencent-scf/blob/master/docs/configure.md
   component: scf # 引用 component 的名称
   name: transcode-video # 创建的实例名称，请修改成您的实例名称
   
   #组件参数
   inputs:
     name: transcode-video-${app}-${stage}
     src: ./src
     handler: index.main_handler 
     role: transcodeRole # 函数运行角色，已授予cos对应桶全读写权限
     runtime: Python3.6 
     memorySize: 3072 # 内存大小，单位MB
     timeout: 43200 # 函数执行超时时间, 单位秒, 即本demo目前最大支持12h运行时长
     region: ${env:REGION} # 函数区域，统一在环境变量中定义
     asyncRunEnable: true # 开启长时运行
     cls: # 函数日志
       logsetId: ${output:${stage}:${app}:cls-video.logsetId}  # cls日志集  cls-video为cls组件的实例名称
       topicId: ${output:${stage}:${app}:cls-video.topicId}  # cls日志主题
     environment: 
       variables:  # 转码参数
         REGION: ${env:REGION} # 输出桶区域
         DST_BUCKET: test-123456789 # 输出桶名称
         DST_PATH: video/outputs/ # 输出桶路径
         DST_FORMAT: avi # 转码生成格式
         FFMPEG_CMD: ffmpeg -i {input} -y -f {dst_format} {output}  # 转码基础命令，您可自定义配置，但必须包含ffmpeg配置参数和格式化部分，否则会造成转码任务失败。
         FFMPEG_DEBUG: 1 # 是否输出ffmpeg日志 0为不输出 1为输出
         TZ: Asia/Shanghai # cls日志输出时间的时区
     events:
       - cos: # cos触发器    	
           parameters:          
             bucket: test-123456789.cos.ap-shanghai.myqcloud.com  # 输入文件桶
             filter:
               prefix: video/inputs/  # 桶内路径
             events: 'cos:ObjectCreated:*'  # 触发事件
             enable: true
   ```

   >?
   >
   >- 输出桶与函数建议配置在同一区域，跨区域配置应用稳定性及效率都会降低，并且会产生跨区流量费用。
   >- 内存大小上限为3072 MB，运行时长上限为43200 s。如需调整，请提工单申请配额调整。
   >- 转码应用必须开启函数长时运行asyncRunEnable: true。
   >- 运行角色请根据[运行角色](#运行角色)创建并授权。
   >- 示例配置的ffmpeg指令仅适用于avi转码场景，详细介绍参考[ffmpeg指令]( #FFmpeg指令)。

5. 在`transcode-app`项目目录下，执行`sls deploy`部署项目。

   ```
   cd transcode-app && sls deploy
   ```

6. 上传视频文件到已经配置好的cos桶指定路径，则会自动转码。本示例中是cos桶`test-123456789.cos.ap-shanghai.myqcloud.com`下的`/video/inputs/`

7. 转码成功后，文件将保存在您配置的输出桶路径中。本示例中是cos桶`test-123456789.cos.ap-shanghai.myqcloud.com`下的`/video/outputs/`

8. 如果需要调整转码配置，修改文件`transcode/serverless.yml` 后，重新部署云函数即可：

   ```
   cd transcode && sls deploy
   ```

##  监控与日志  

批量文件上传到cos会并行触发转码执行。

1. 登陆云函数控制台，查看日志监控。
![1608278445413](https://main.qcloudimg.com/raw/ce7f8a54fe41408be857fed9b251a388.png)
2. 直接点击函数对应的cls日志，查看日志检索分析 。
![1608278445413](https://main.qcloudimg.com/raw/848f3cd68b63000c069a1ad43aeaa8a9.jpg)
![1608278445413](https://main.qcloudimg.com/raw/5db54886ce37e132bfa3a324651cf193.png)

## FFmpeg工具

### ffmpeg指令

yml文件 `transcode-app/transcode/serverless.yml`中 `DST_FORMAT`与`FFMPEG_CMD`指定了转码应用的转码指令，您可根据应用场景自定义配置。

例：转码mp4格式视频，可以将FFMPEG_CMD配置为:

```
DST_FORMAT: mp4
FFMPEG_CMD: ffmpeg -i {input} -vcodec copy -y -f {dst_format} -movflags frag_keyframe+empty_moov {output}
```


> 说明：
>
> - FFMPEG_CMD 必须包含ffmpeg配置参数和格式化部分，否则会造成转码任务失败。
> - ffmpeg不同转码场景下指令配置参数不同，因此需要您具有一定的ffmpeg使用经验。以上提供的指令仅仅是针对这几个应用场景的指令。更多ffmpeg指令参考[FFmpeg官网](https://ffmpeg.org/documentation.html)。

### 自定义ffmpeg

转码应用场景中提供了默认的ffmpeg工具，如果您想自定义ffmpeg，执行以下操作：

1. 将样例中的ffmpeg替换成你自定义的ffmpeg。
2. 在`transcode-app/transcode`目录下再次执行sls deploy部署更新。

```
 cd transcode && sls deploy
```


> 说明：
>
> 自行编译的ffmpeg环境与云函数运行环境如果不同，可能会导致ffmpeg权限问题。我们提供了云函数执行环境的官方镜像，请使用[官方镜像环境](https://cloud.tencent.com/document/product/583/50826)编译您的ffmpeg。



## 运行角色

转码函数运行时需要读取cos资源进行转码，并将转码后的资源写回cos，因此需要给函数配置一个授权cos全读写的运行角色。更多参考[函数运行角色](https://cloud.tencent.com/document/product/583/47933#.E8.BF.90.E8.A1.8C.E8.A7.92.E8.89.B2)。

1. 登录 [访问管理](https://console.cloud.tencent.com/cam/role) 控制台，选择新建角色，角色载体为腾讯云产品服务。
 ![1608278445413](https://main.qcloudimg.com/raw/ee9eefec88e036b8cc9b4266b502a9e4.png) 

2. 在“输入角色载体信息”步骤中勾选【云函数（scf）】，并单击【下一步】：
![1608278445413](https://main.qcloudimg.com/raw/62c18b6d88184867cfabc3e1cab48d02.png)

3. 在“配置角色策略”步骤中，选择函数所需策略并单击【下一步】。如下图所示：
![1608278445413](https://main.qcloudimg.com/raw/3f8cde5ebf83998c72641f26c8804462.png)
   

   > 说明：
   >
   > 您可以直接选择 `QcloudCOSFullAccess` 对象存储（COS）全读写访问权限，如果需要更细粒度的权限配置，请根据实际情况配置选择。

4. 输入角色名称，完成创建角色及授权。该角色将作为函数的运行角色，配置在文件`transcode-app/transcode/serverless.yml`  中。![1608278445413](https://main.qcloudimg.com/raw/d5d1532a9c9d505e64eef2442b594fac.png)


    > 说明：
    >
    > 由于运行角色密钥最长有效期为12小时，因此函数配置的超时时间不能大于12小时。如果您需要更长的函数执行时长，可以通过改造`transcode-app/transcode/src/index.py`  中的访问cos方式，配置永久密钥去读写访问cos。但这样会暴露您的密钥在代码中，请谨慎使用。

