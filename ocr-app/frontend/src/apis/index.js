import axios from 'axios';
import Cos from 'cos-js-sdk-v5';
import CONFIG from '../config';

const request = axios.create({
  baseURL: CONFIG.baseUrl,
  timeout: CONFIG.timout,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function getCosToken(uuid) {
  const res = await request.post(`/token`, {
    uuid,
  });
  if (res.data.code === 0) {
    return res.data;
  } else {
    throw res.data.error;
  }
}

async function uploadToCos(uuid, file) {
  return new Promise(async (resolve, reject) => {
    const { data } = await getCosToken(uuid);
    const cos = new Cos({
      getAuthorization(options, callback) {
        try {
          callback({
            TmpSecretId: data.Credentials.TmpSecretId,
            TmpSecretKey: data.Credentials.TmpSecretKey,
            XCosSecurityToken: data.Credentials.Token,
            StartTime: data.StartTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: data.ExpiredTime, // 时间戳，单位秒，如：1580000900
          });
        } catch (e) {
          reject(e);
        }
      },
    });
    cos.putObject(
      {
        Bucket: data.BucketName,
        Region: data.Region,
        Key: `${uuid}/${file.name}`,
        Body: file,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(`https://${data.Location}`);
        }
      },
    );
  });
}

async function getOcrResult(imgUrl) {
  const res = await request.post(`/ocr`, {
    imgUrl,
  });
  if (res.data.code === 0) {
    return res.data;
  } else {
    throw res.data.error;
  }
}

export { getCosToken, uploadToCos, getOcrResult };
