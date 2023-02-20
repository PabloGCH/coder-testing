import { config as dotenv} from "dotenv";

dotenv()
export const config = {
	admin : true,
	database: 'Mongo',
	mongo: {
		ulr: process.env.DB_MONGO_URL
	}

}
