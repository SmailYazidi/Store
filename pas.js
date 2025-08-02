import bcrypt from "bcryptjs"

async function hashPassword() {
  const hash = await bcrypt.hash("admin", 12)
  console.log("Hashed password:", hash)
}

hashPassword()
