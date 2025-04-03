/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { eq } from 'drizzle-orm'
import { db } from '../db.js'
import { NewUser, User, users } from './schema.js'

export async function addUser(user: NewUser) {
  try {
    await db.insert(users).values(user)
    return { success: true, message: 'User added successfully' }
  } catch (error) {
    console.error('Error adding user:', error)
    throw new Error(
      'Database insert failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    )
  }
}

export async function deleteUser(username: User['username']) {
  await db.delete(users).where(eq(users.username, username))
}

export async function getUser(username: User['username']) {
  const res = await db.select().from(users).where(eq(users.username, username))
  if (res.length === 0) {
    throw new Error(`User \`${username}\` does not exist!`)
  }
  if (res.length > 1) {
    throw new Error(`There are multiple users with the name \`${username}\`!`)
  }
  return res[0]
}

export async function isUsernameExisting(username: User['username']) {
  try {
    await getUser(username)
    return true
  } catch {
    return false
  }
}

export async function isPasswordCorrect(user: User) {
  try {
    const record = await getUser(user.username)
    return record.password === user.password
  } catch {
    return false
  }
}
