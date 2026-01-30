import { NextRequest, NextResponse } from 'next/server';
import { testTursoConnection, initializeTursoSchema } from '../../../lib/tursoStorage';
import { testMongoDBConnection } from '../../../lib/mongodbStorage';

export const dynamic = 'force-dynamic';

/**
 * GET /api/storage/test
 * Test all database connections
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API: Testing all storage connections...');

    // Test both connections in parallel
    const [mongoConnected, tursoConnected] = await Promise.all([
      testMongoDBConnection(),
      testTursoConnection(),
    ]);

    const status = {
      mongodb: {
        connected: mongoConnected,
        status: mongoConnected ? 'connected' : 'disconnected',
      },
      turso: {
        connected: tursoConnected,
        status: tursoConnected ? 'connected' : 'disconnected',
      },
      overall: mongoConnected || tursoConnected ? 'healthy' : 'unhealthy',
    };

    console.log('API: Storage status:', status);

    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API: Error testing storage connections:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: {
        mongodb: { connected: false, status: 'error' },
        turso: { connected: false, status: 'error' },
        overall: 'error',
      },
    }, { status: 500 });
  }
}

/**
 * POST /api/storage/test
 * Initialize Turso schema
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'init-turso') {
      console.log('API: Initializing Turso schema...');
      
      const initialized = await initializeTursoSchema();

      if (initialized) {
        return NextResponse.json({
          success: true,
          message: 'Turso schema initialized successfully',
          timestamp: new Date().toISOString(),
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to initialize Turso schema. Check server logs for details.',
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use action: "init-turso"',
    }, { status: 400 });
  } catch (error) {
    console.error('API: Error in storage POST:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
