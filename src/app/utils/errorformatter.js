export function formatError(err) {
	console.log(err);
	return err?.response?.message ?? err?.response?.data?.message;
}