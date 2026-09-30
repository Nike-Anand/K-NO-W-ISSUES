import express from 'express';
import cors from 'cors';
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { INITIAL_ISSUES, CROSS_BRICS_SIGNALS } from './src/data/mockData.ts';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AWS DynamoDB (uses default credentials from environment/AWS CLI)
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const ISSUES_TABLE = 'LokDrishtiIssues';
const REPORTS_TABLE = 'LokDrishtiReports';
const BRICS_TABLE = 'LokDrishtiBrics';
const BRIEFS_TABLE = 'LokDrishtiBriefs';
const RESPONSES_TABLE = 'LokDrishtiResponses';
const DEPARTMENTS_TABLE = 'LokDrishtiDepartments';
const APP_CONFIG_TABLE = 'LokDrishtiAppConfig';

const MOCK_BRIEFS = [
  { id: 'b1', title: 'Daily Operations Summary - Chennai', date: 'Sep 30, 2026', type: 'Daily' },
  { id: 'b2', title: 'Weekly Infrastructure Deficit Report', date: 'Sep 28, 2026', type: 'Weekly' },
  { id: 'b3', title: 'Power Grid Stability Assessment', date: 'Sep 25, 2026', type: 'Special' }
];

const MOCK_RESPONSES = [
  { id: 'r1', region: 'Chennai South', msg: 'Waterlogging clearance in progress by GCC.', time: '1 hour ago' },
  { id: 'r2', region: 'Coimbatore', msg: 'Power restoration expected in 2 hours for RS Puram.', time: '3 hours ago' }
];

const MOCK_DEPARTMENTS = [
  { id: 'd1', name: 'TANGEDCO (Energy)', issues: 24, time: '4.2 hrs', status: 'NOMINAL', color: 'text-emerald-600' },
  { id: 'd2', name: 'CMWSSB (Water)', issues: 18, time: '12.5 hrs', status: 'WARNING', color: 'text-amber-600' },
  { id: 'd3', name: 'GCC (Roads)', issues: 32, time: '48+ hrs', status: 'CRITICAL', color: 'text-rose-600' },
  { id: 'd4', name: 'Traffic Police', issues: 5, time: '1.1 hrs', status: 'EXCELLENT', color: 'text-emerald-600' }
];

const MOCK_APP_CONFIG = [
  {
    id: 'locations',
    areas: ['Chennai', 'Bengaluru', 'Coimbatore', 'Mumbai'],
    regions: {
      'Tamil Nadu': ['Chennai', "Coimbatore"],
      'Karnataka': ['Bengaluru']
    }
  },
  {
    id: 'analytics',
    averageResolutionTime: '14.2 hrs',
    resolutionDelta: '↓ 2.1 hrs from last week',
    mostReportedCategory: 'Energy (⚡)',
    categoryDelta: '↑ 14% spike today',
    citizenTrustScore: '94.8%',
    trustDelta: 'High verification rate',
    issueInflux: [40, 60, 45, 80, 50, 90, 70],
    avgAck: '42 min',
    dispatchRes: '5.2 hrs',
    verificationRate: '91.4%'
  },
  {
    id: 'aiInsights',
    confidence: '94%',
    insights: [
      {
        type: 'Cluster Detected',
        desc: 'Automated spatial grouping correlated 1,248 complaints across 7 feeder zones without exposing personal voter or resident identities.',
        highlight: true
      },
      {
        type: 'Under-reported Signal',
        desc: 'Anomalous silence detected in 2nd Avenue informal market sector; potential priority follow-up needed.',
        highlight: false
      }
    ]
  }
];

// Ensure table exists helper
async function ensureTable(tableName) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    console.log(`Table ${tableName} exists.`);
  } catch (err) {
    if (err.name === 'ResourceNotFoundException') {
      console.log(`Creating table ${tableName}...`);
      await client.send(new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        BillingMode: 'PAY_PER_REQUEST'
      }));
      console.log(`Created table ${tableName}. Waiting for active status...`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // basic wait
    } else {
      throw err;
    }
  }
}

// Seed initial data if empty
async function seedTableIfEmpty(tableName, dataArray) {
  const { Items } = await docClient.send(new ScanCommand({ TableName: tableName }));
  if (Items.length === 0) {
    console.log(`Seeding ${tableName}...`);
    for (const item of dataArray) {
      await docClient.send(new PutCommand({ TableName: tableName, Item: item }));
    }
  }
}

// Initialize tables
async function initDB() {
  await ensureTable(ISSUES_TABLE);
  await ensureTable(REPORTS_TABLE);
  await ensureTable(BRICS_TABLE);
  await ensureTable(BRIEFS_TABLE);
  await ensureTable(RESPONSES_TABLE);
  await ensureTable(DEPARTMENTS_TABLE);
  await ensureTable(APP_CONFIG_TABLE);
  
  await seedTableIfEmpty(ISSUES_TABLE, INITIAL_ISSUES);
  await seedTableIfEmpty(BRICS_TABLE, CROSS_BRICS_SIGNALS);
  await seedTableIfEmpty(BRIEFS_TABLE, MOCK_BRIEFS);
  await seedTableIfEmpty(RESPONSES_TABLE, MOCK_RESPONSES);
  await seedTableIfEmpty(DEPARTMENTS_TABLE, MOCK_DEPARTMENTS);
  await seedTableIfEmpty(APP_CONFIG_TABLE, MOCK_APP_CONFIG);
}

// API Routes
app.get('/api/issues', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: ISSUES_TABLE }));
    res.json(Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/issues', async (req, res) => {
  try {
    const issue = req.body;
    await docClient.send(new PutCommand({ TableName: ISSUES_TABLE, Item: issue }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reports', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: REPORTS_TABLE }));
    res.json(Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const report = req.body;
    await docClient.send(new PutCommand({ TableName: REPORTS_TABLE, Item: report }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/brics', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: BRICS_TABLE }));
    res.json(Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/briefs', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: BRIEFS_TABLE }));
    res.json(Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/briefs', async (req, res) => {
  try {
    await docClient.send(new PutCommand({ TableName: BRIEFS_TABLE, Item: req.body }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/responses', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: RESPONSES_TABLE }));
    res.json(Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/responses', async (req, res) => {
  try {
    await docClient.send(new PutCommand({ TableName: RESPONSES_TABLE, Item: req.body }));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/departments', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: DEPARTMENTS_TABLE }));
    res.json(Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/config', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({ TableName: APP_CONFIG_TABLE }));
    res.json(Items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, async () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  try {
    await initDB();
    console.log('DynamoDB initialized successfully.');
  } catch (err) {
    console.error('Failed to init DynamoDB:', err);
  }
});
