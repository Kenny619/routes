import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
}

export async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export async function createKey(kv: KVNamespace, url: string) {
	const uuid = crypto.randomUUID();
	const key = uuid.substring(0, 6);
	const result = await kv.get(key);
	if (!result) {
		await kv.put(key, url);
	} else {
		return await createKey(kv, url);
	}
	return key;
}
