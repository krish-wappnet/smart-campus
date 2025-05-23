import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

// Create a new connection to the database
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '12345',
  database: process.env.DATABASE_NAME || 'smart_campus',
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
});

// Initialize the connection
AppDataSource.initialize()
  .then(async (dataSource) => {
    console.log('Successfully connected to the database');
    
    // Get all table names
    const queryRunner = dataSource.createQueryRunner();
    const tables = await queryRunner.query(
      `SELECT table_name 
       FROM information_schema.tables 
       WHERE table_schema = 'public'`
    );
    
    console.log('\nTables in the database:');
    console.table(tables.map((t: any) => ({ 'Table Name': t.table_name })));
    
    // Check if the classes table exists and has data
    if (tables.some((t: any) => t.table_name === 'classes')) {
      const classCount = await queryRunner.query('SELECT COUNT(*) as count FROM classes');
      console.log('\nNumber of classes in the database:', classCount[0].count);
      
      if (parseInt(classCount[0].count, 10) > 0) {
        const sampleClass = await queryRunner.query('SELECT * FROM classes LIMIT 1');
        console.log('\nSample class data:');
        console.table(sampleClass);
      }
    }
    
    // Close the connection
    await queryRunner.release();
    await dataSource.destroy();
    console.log('\nDatabase connection closed');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
