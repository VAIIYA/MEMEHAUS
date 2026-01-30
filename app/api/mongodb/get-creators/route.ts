import { NextRequest, NextResponse } from 'next/server';
import { getAllCreators } from '../../../lib/unifiedStorage';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching creators from unified storage...');
    
    const creators = await getAllCreators();
    
    console.log(`API: Found ${creators.length} creators in unified storage`);
    
    return NextResponse.json({
      success: true,
      creators,
      totalCreators: creators.length,
      lastUpdated: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('API: Error fetching creators:', error);
    
    return NextResponse.json({
      success: false,
      creators: [],
      totalCreators: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
