import * as Minio from 'minio';

export const s3Client = new Minio.Client({
	endPoint: process.env.MINIO_SERVER_ENDPOINT as string,
	port: 9000,
	useSSL: false,
	accessKey: process.env.MINIO_SERVER_ACCESS_KEY as string,
	secretKey: process.env.MINIO_SERVER_SECRET_KEY as string,
});

export async function createBucketIfNotExists(bucketName: string) {
	const bucketExists = await s3Client.bucketExists(bucketName);
	if (!bucketExists) {
		await s3Client.makeBucket(bucketName);
	}
}

/**
 * Save file in S3 bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @param file file to save
 */
export async function saveFileInBucket({
	bucketName,
	fileName,
	file,
}: {
	bucketName: string;
	fileName: string;
	file: Buffer | internal.Readable;
}) {
	// Create bucket if it doesn't exist
	await createBucketIfNotExists(bucketName);

	// check if file exists - optional.
	// Without this check, the file will be overwritten if it exists
	const fileExists = await checkFileExistsInBucket({
		bucketName,
		fileName,
	});

	if (fileExists) {
		throw new Error('File already exists');
	}

	// Upload image to S3 bucket
	await s3Client.putObject(bucketName, fileName, file);
}

/**
 * Check if file exists in bucket
 * @param bucketName name of the bucket
 * @param fileName name of the file
 * @returns true if file exists, false if not
 */
export async function checkFileExistsInBucket({
	bucketName,
	fileName,
}: {
	bucketName: string;
	fileName: string;
}) {
	try {
		await s3Client.statObject(bucketName, fileName);
	} catch (error) {
		return false;
	}
	return true;
}
