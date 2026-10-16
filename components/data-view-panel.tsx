'use client';

import { SystemStats, ParkingSlot } from '@/lib/parking-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Bike, Truck, DollarSign, TrendingUp, Users, Clock } from 'lucide-react';

interface DataViewPanelProps {
  stats: SystemStats;
  slots: ParkingSlot[];
  simTime: number;
  errorCode: number;
}

export function DataViewPanel({ stats, slots, simTime, errorCode }: DataViewPanelProps) {
  const occupancyRate = ((stats.currentOccupancy / 32) * 100).toFixed(1);
  const avgFee = stats.totalExits > 0 ? (stats.totalRevenue / stats.totalExits).toFixed(2) : '0.00';

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="bg-muted/30 border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <div>
                <div className="text-lg font-bold">{stats.currentOccupancy}/32</div>
                <div className="text-[10px] text-muted-foreground">Occupancy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              <div>
                <div className="text-lg font-bold">${stats.totalRevenue}</div>
                <div className="text-[10px] text-muted-foreground">Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="text-lg font-bold">{occupancyRate}%</div>
                <div className="text-[10px] text-muted-foreground">Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <div>
                <div className="text-lg font-bold">{simTime}</div>
                <div className="text-[10px] text-muted-foreground">Sim Ticks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Breakdown */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Vehicle Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-400" />
              <div>
                <div className="font-bold">{stats.carCount}/16</div>
                <div className="text-[10px] text-muted-foreground">Cars</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-green-400" />
              <div>
                <div className="font-bold">{stats.bikeCount}/10</div>
                <div className="text-[10px] text-muted-foreground">Bikes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-400" />
              <div>
                <div className="font-bold">{stats.truckCount}/6</div>
                <div className="text-[10px] text-muted-foreground">Trucks</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Table */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Analytics</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Entries</span>
              <span className="font-mono">{stats.totalEntries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Exits</span>
              <span className="font-mono">{stats.totalExits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Peak Occupancy</span>
              <span className="font-mono">{stats.peakOccupancy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Fee/Vehicle</span>
              <span className="font-mono text-yellow-400">${avgFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Error Code</span>
              <span className="font-mono text-red-400">0x{errorCode.toString(16).padStart(2, '0').toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory View (Simulated) */}
      <Card className="bg-muted/30 border-border">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm">Memory View (g_system)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="font-mono text-[10px] text-cyan-400 bg-black/30 p-2 rounded overflow-x-auto">
            <div>slots[32]     @ 0x20000000</div>
            <div>flags         @ 0x20000400 = 0x{
              Object.values(slots[0] ? { occupied: stats.currentOccupancy > 0 } : {}).length.toString(16).padStart(4, '0')
            }</div>
            <div>current_state @ 0x20000404 = {stats.currentOccupancy}</div>
            <div>stats         @ 0x20000408</div>
            <div>  .entries    = {stats.totalEntries}</div>
            <div>  .exits      = {stats.totalExits}</div>
            <div>  .revenue    = {stats.totalRevenue}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
