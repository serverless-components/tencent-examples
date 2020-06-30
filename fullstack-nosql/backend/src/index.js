const tcb = require('tcb-admin-node')

const app = tcb.init({
	secretId: process.env.SecretId,
	secretKey: process.env.SecretKey,
	env: process.env.MongoId,
	serviceUrl: 'https://tcb-admin.tencentcloudapi.com/admin'
})

const db = app.database()

const _ = db.command

exports.main = async (event, context) => {

	// 没有集合，则会创建这个集合
	// 作为Demo，将此步骤放入main中，实际生产过程中，该部分应该在外围定义
	await db.createCollection('serverless')

	// 获取用户post的数据
	const username = JSON.parse(event.body).username
	const age = JSON.parse(event.body).age
	const gender = JSON.parse(event.body).gender

	// 操作serverless集合
	// 仅作为Demo，collection对象在main中定义，实际生产过程中，该部分应该在外围定义
	const collection = db.collection('serverless')

	if (username && age && gender) {
			// 将数据写入到集合
			await collection.add({username: username, age: age, gender: gender})
		
		}
		// 获取集合内所有数据并且返回
		const userList = await collection.get()
		return userList

}
