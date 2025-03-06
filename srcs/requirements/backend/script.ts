/* Script to interact with the database */
import crypto from 'crypto'
import { prisma } from './src/utils/prisma'

async function main() {
	await prisma.user.deleteMany()
	const user = await prisma.user.create({ 
		data: {
			name: "Kyle",
			email: "kyle23@email.com",
			password: "securepassword",
			salt: crypto.randomBytes(16).toString("hex")
		}, 
	})
	console.log(user)
  }
  
main()
	.catch(async (e) => {
		console.error(e.message)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
