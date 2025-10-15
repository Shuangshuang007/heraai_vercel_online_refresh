#!/usr/bin/env node
/**
 * MongoDB Migration Script: Add sortDate field and create indexes
 * 
 * This script:
 * 1. Adds a unified sortDate field to all job documents
 * 2. Creates necessary indexes for FAST mode performance
 * 
 * sortDate = postedDateISO || createdAt || updatedAt
 * 
 * Usage:
 *   node scripts/add-sortdate-and-indexes.js
 * 
 * Environment variables:
 *   MONGODB_URI - MongoDB connection string
 */

const { MongoClient } = require('mongodb');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'hera_jobs';
const COLLECTION_NAME = 'hera_jobs.jobs';

// Color output for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  log('\n=== MongoDB Migration: Add sortDate and Indexes ===\n', 'blue');
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 60000,
  });

  try {
    // Connect to MongoDB
    log('Connecting to MongoDB...', 'yellow');
    await client.connect();
    log('✓ Connected successfully\n', 'green');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // ============================================
    // Step 1: Add sortDate field
    // ============================================
    log('Step 1: Adding sortDate field to documents...', 'blue');
    
    // Find documents without sortDate
    const countWithoutSortDate = await collection.countDocuments({ sortDate: { $exists: false } });
    log(`Found ${countWithoutSortDate} documents without sortDate`, 'yellow');

    if (countWithoutSortDate > 0) {
      // Use aggregation pipeline update
      const result = await collection.updateMany(
        { sortDate: { $exists: false } },
        [
          {
            $set: {
              sortDate: {
                $ifNull: [
                  '$postedDateISO',
                  {
                    $ifNull: ['$createdAt', '$updatedAt']
                  }
                ]
              }
            }
          }
        ]
      );
      
      log(`✓ Updated ${result.modifiedCount} documents with sortDate\n`, 'green');
    } else {
      log('✓ All documents already have sortDate\n', 'green');
    }

    // ============================================
    // Step 2: Create indexes
    // ============================================
    log('Step 2: Creating indexes...', 'blue');

    // Get existing indexes
    const existingIndexes = await collection.indexes();
    const indexNames = existingIndexes.map(idx => idx.name);
    log(`Existing indexes: ${indexNames.join(', ')}`, 'yellow');

    // Index 1: sortDate descending (for time-based sorting)
    if (!indexNames.includes('sortDate_-1')) {
      log('Creating index: sortDate_-1...', 'yellow');
      await collection.createIndex({ sortDate: -1 }, { name: 'sortDate_-1' });
      log('✓ Created sortDate index', 'green');
    } else {
      log('✓ sortDate index already exists', 'green');
    }

    // Index 2: title text index (for fuzzy search)
    if (!indexNames.includes('title_1')) {
      log('Creating index: title_1...', 'yellow');
      await collection.createIndex({ title: 1 }, { name: 'title_1' });
      log('✓ Created title index', 'green');
    } else {
      log('✓ title index already exists', 'green');
    }

    // Index 3: location text index
    if (!indexNames.includes('location_1')) {
      log('Creating index: location_1...', 'yellow');
      await collection.createIndex({ location: 1 }, { name: 'location_1' });
      log('✓ Created location index', 'green');
    } else {
      log('✓ location index already exists', 'green');
    }

    // Index 4: is_active filter index
    if (!indexNames.includes('is_active_1')) {
      log('Creating index: is_active_1...', 'yellow');
      await collection.createIndex({ is_active: 1 }, { name: 'is_active_1' });
      log('✓ Created is_active index', 'green');
    } else {
      log('✓ is_active index already exists', 'green');
    }

    // Index 5: Compound index for FAST queries (title + location + sortDate)
    if (!indexNames.includes('fast_search_compound')) {
      log('Creating compound index: title_1_location_1_sortDate_-1...', 'yellow');
      await collection.createIndex(
        { title: 1, location: 1, sortDate: -1 },
        { name: 'fast_search_compound' }
      );
      log('✓ Created compound index for FAST search', 'green');
    } else {
      log('✓ Compound index already exists', 'green');
    }

    // Index 6: postedDateISO (fallback for old queries)
    if (!indexNames.includes('postedDateISO_-1')) {
      log('Creating index: postedDateISO_-1...', 'yellow');
      await collection.createIndex({ postedDateISO: -1 }, { name: 'postedDateISO_-1' });
      log('✓ Created postedDateISO index', 'green');
    } else {
      log('✓ postedDateISO index already exists', 'green');
    }

    // ============================================
    // Step 3: Verify results
    // ============================================
    log('\nStep 3: Verification...', 'blue');

    const totalDocs = await collection.countDocuments();
    const docsWithSortDate = await collection.countDocuments({ sortDate: { $exists: true } });
    const coverage = ((docsWithSortDate / totalDocs) * 100).toFixed(2);

    log(`Total documents: ${totalDocs}`, 'yellow');
    log(`Documents with sortDate: ${docsWithSortDate} (${coverage}%)`, 'yellow');

    // Sample document with sortDate
    const sampleDoc = await collection.findOne({ sortDate: { $exists: true } });
    if (sampleDoc) {
      log('\nSample document:', 'yellow');
      log(JSON.stringify({
        id: sampleDoc.id,
        title: sampleDoc.title,
        sortDate: sampleDoc.sortDate,
        postedDateISO: sampleDoc.postedDateISO,
        createdAt: sampleDoc.createdAt,
        updatedAt: sampleDoc.updatedAt,
      }, null, 2), 'yellow');
    }

    // List all indexes
    const finalIndexes = await collection.indexes();
    log('\nFinal indexes:', 'yellow');
    finalIndexes.forEach(idx => {
      log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`, 'yellow');
    });

    log('\n✓ Migration completed successfully!\n', 'green');

    // ============================================
    // Step 4: Performance test query
    // ============================================
    log('Step 4: Running performance test query...', 'blue');
    
    const testStart = Date.now();
    const testResult = await collection
      .find({
        title: { $regex: 'software', $options: 'i' },
        location: { $regex: 'melbourne', $options: 'i' },
        is_active: { $ne: false }
      })
      .sort({ sortDate: -1 })
      .limit(20)
      .toArray();
    const testElapsed = Date.now() - testStart;

    log(`✓ Test query completed in ${testElapsed}ms`, 'green');
    log(`  Found ${testResult.length} results`, 'yellow');
    
    if (testResult.length > 0) {
      log(`  Latest job: ${testResult[0].title} (${testResult[0].sortDate})`, 'yellow');
    }

  } catch (error) {
    log(`\n✗ Error: ${error.message}\n`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    await client.close();
    log('Connection closed.\n', 'yellow');
  }
}

// Run migration
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});



