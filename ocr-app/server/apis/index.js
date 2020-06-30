const { Capi } = require('@tencent-sdk/capi');

class CloudApi {
  constructor() {
    const {
      REGION,
      TENCENT_APP_ID,
      TENCENT_SECRET_ID,
      TENCENT_SECRET_KEY,
      BUCKET,
    } = process.env;

    this.capi = new Capi({
      Region: REGION,
      SecretId: TENCENT_SECRET_ID,
      SecretKey: TENCENT_SECRET_KEY,
    });

    this.REGION = REGION;
    this.TENCENT_APP_ID = TENCENT_APP_ID;
    this.TENCENT_SECRET_ID = TENCENT_SECRET_ID;
    this.TENCENT_SECRET_KEY = TENCENT_SECRET_KEY;
    this.BUCKET = BUCKET;
  }

  /**
   * get cos temporary credential for uploading picture to cos
   * @param {string} uuid uuid
   */
  async getCosTmpCredential(uuid) {
    const { Response } = await this.capi.request(
      {
        Action: 'GetFederationToken',
        Version: '2018-08-13',
        Name: uuid,
        // policies for upload
        Policy: JSON.stringify({
          version: '2.0',
          statement: [
            {
              effect: 'allow',
              action: [
                'name/cos:PutObject',
              ],
              resource: [
                `qcs::cos:${this.REGION}:uid/${this.TENCENT_APP_ID}:prefix//${this.TENCENT_APP_ID}/${this.BUCKET}/*`,
              ],
            },
          ],
        }),
        DurationSeconds: 7200,
      },
      {
        host: 'sts.tencentcloudapi.com',
      },
    );
    Response.StartTime = Math.round(Date.now() / 1000);
    Response.Region = this.REGION;
    Response.BucketName = `${this.BUCKET}-${this.TENCENT_APP_ID}`;
    return Response;
  }

  /**
   * get OCR result
   * @param {string} imgUrl image url
   * @param {string} lang language, default zh
   */
  async getOCRResult(imgUrl, lang = 'zh') {
    const { Response } = await this.capi.request(
      {
        Action: 'GeneralBasicOCR',
        Version: '2018-11-19',
        ImageUrl: imgUrl,
        LanguageType: lang,
      },
      {
        host: 'ocr.tencentcloudapi.com',
      },
    );
    return Response;
  }
}

module.exports = CloudApi;
