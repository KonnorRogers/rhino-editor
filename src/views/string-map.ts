export function stringMap(obj: Record<string, string | null | undefined | boolean>): string {
	let string = ""

	for (const [key, value] of Object.entries(obj)) {
		if (value) {
			string += `${key} `
		}
	}

	return string
}

