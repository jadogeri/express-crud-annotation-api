// jest.setup.ts
import * as dotenv from 'dotenv';
import { resolve } from 'path';

export default async function globalSetup() {
    console.log(`all tests - global setup............................... `);

  dotenv.config({ path: resolve(process.cwd(), '.test.env') });
}
