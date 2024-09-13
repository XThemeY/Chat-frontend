import { getServerSession } from 'next-auth';
import { authOptions } from '../utils/authOptions';

export default async function getSession() {
	const session = await getServerSession(authOptions);

	return session;
}
