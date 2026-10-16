"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Cpu,
  GitBranch,
  Layers,
  Target,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

export function DocumentationFull() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-card border border-border p-1">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="architecture" className="text-xs">Architecture</TabsTrigger>
          <TabsTrigger value="states" className="text-xs">State Machine</TabsTrigger>
          <TabsTrigger value="algorithms" className="text-xs">Algorithms</TabsTrigger>
          <TabsTrigger value="keil" className="text-xs">Keil Setup</TabsTrigger>
          <TabsTrigger value="testing" className="text-xs">Testing</TabsTrigger>
          <TabsTrigger value="viva" className="text-xs">Viva Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <p>
                  <strong className="text-foreground">Title:</strong> Smart Parking Management and Analytics System Using ARM Microcontroller With Live Debug Dashboard
                </p>
                <p>
                  A comprehensive embedded systems project demonstrating real-world parking lot management simulation that runs entirely in Keil uVision ARM simulator.
                </p>
                <div className="pt-2">
                  <strong className="text-foreground">Input Data:</strong>
                  <pre className="mt-1 p-2 bg-secondary/50 rounded text-xs font-mono">
{`occupancyMask = 0xA5A5000F
parkingMinutes = {45, 120, 15, 240, 90, 30, 180, 60}
inputPlate = "ka05Ab1234"`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {["Represent 32 parking slots using 32-bit occupancy mask", 
                    "Implement bubble sort for ascending/descending ordering",
                    "Calculate parking fees with Rs.20/hour rate",
                    "Simulate interrupt-based overtime alert system",
                    "Create live debug dashboard visible in Keil Watch Window",
                    "Implement self-test validation for all outputs"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  Software Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "IDE", value: "Keil uVision 5" },
                    { label: "Target", value: "ARM Cortex-M" },
                    { label: "Language", value: "Embedded C" },
                    { label: "Compiler", value: "ARM Compiler 6" },
                    { label: "Hardware", value: "Simulator Only", outline: true },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{item.label}</span>
                      <Badge variant={item.outline ? "outline" : "secondary"}>{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Real-World Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {["Smart parking lot management systems", "Mall/airport parking automation", "Toll plaza fee calculation", 
                    "Vehicle tracking and monitoring", "IoT-based parking solutions", "Revenue management systems"].map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Lab Manual Concepts Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {[
                  { exp: "Exp 1: Flags", desc: "N, Z, C, V flags in comparisons" },
                  { exp: "Exp 2: Data Transfer", desc: "MOV operations for initialization" },
                  { exp: "Exp 4: Sum of Numbers", desc: "Loop-based revenue accumulation" },
                  { exp: "Exp 5: Find Largest", desc: "Array traversal for min/max" },
                  { exp: "Exp 6: Count 1s and 0s", desc: "Bit counting for occupancy" },
                  { exp: "Exp 7: Bubble Sort", desc: "Sorting parking duration" },
                  { exp: "Exp 9: Case Conversion", desc: "License plate normalization" },
                  { exp: "Exp 10: Interrupts", desc: "Software flag-based alerts" },
                ].map((item) => (
                  <div key={item.exp} className="space-y-1">
                    <div className="font-medium text-foreground">{item.exp}</div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Layered Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-primary/10 rounded border border-primary/20">
                    <div className="font-medium text-primary text-sm">Application Layer</div>
                    <div className="text-xs text-muted-foreground mt-1">main.c - State machine control</div>
                  </div>
                  <div className="p-3 bg-secondary rounded">
                    <div className="font-medium text-foreground text-sm">Business Logic Layer</div>
                    <div className="text-xs text-muted-foreground mt-1">parking_system.c - Core algorithms</div>
                  </div>
                  <div className="p-3 bg-secondary rounded">
                    <div className="font-medium text-foreground text-sm">UI/Dashboard Layer</div>
                    <div className="text-xs text-muted-foreground mt-1">ui_dashboard.c - Watch Window display</div>
                  </div>
                  <div className="p-3 bg-muted rounded">
                    <div className="font-medium text-muted-foreground text-sm">Data Layer</div>
                    <div className="text-xs text-muted-foreground mt-1">Global volatile variables</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary" />
                  File Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-mono text-xs space-y-2">
                  {[
                    { name: "main.c", desc: "Main entry, state machine loop" },
                    { name: "parking_system.h", desc: "Constants, enums, declarations" },
                    { name: "parking_system.c", desc: "Core logic implementation" },
                    { name: "ui_dashboard.h", desc: "Dashboard declarations" },
                    { name: "ui_dashboard.c", desc: "Dashboard update functions" },
                  ].map((file) => (
                    <div key={file.name} className="flex items-center gap-3">
                      <span className="text-primary w-36">{file.name}</span>
                      <span className="text-muted-foreground text-[10px]">{file.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="states" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">State Machine Table</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 text-muted-foreground">ID</th>
                      <th className="text-left py-2 px-2 text-muted-foreground">Name</th>
                      <th className="text-left py-2 px-2 text-muted-foreground">Description</th>
                      <th className="text-left py-2 px-2 text-muted-foreground">Flag Set</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {[
                      { id: 0, name: "STATE_POWER_ON", desc: "System startup", flag: "-" },
                      { id: 1, name: "STATE_INIT_DATA", desc: "Load input data", flag: "FLAG_DATA_INIT_DONE" },
                      { id: 2, name: "STATE_SLOT_ANALYSIS", desc: "Count occupied/free", flag: "FLAG_SLOT_ANALYSIS_DONE" },
                      { id: 3, name: "STATE_COPY_DATA", desc: "Copy arrays", flag: "FLAG_DATA_COPY_DONE" },
                      { id: 4, name: "STATE_SORT_ASC", desc: "Sort ascending", flag: "FLAG_ASC_SORT_DONE" },
                      { id: 5, name: "STATE_SORT_DESC", desc: "Sort descending", flag: "FLAG_DESC_SORT_DONE" },
                      { id: 6, name: "STATE_MIN_MAX", desc: "Find min/max", flag: "FLAG_MIN_MAX_DONE" },
                      { id: 7, name: "STATE_FEE_CALC", desc: "Calculate fees", flag: "FLAG_FEE_CALC_DONE" },
                      { id: 8, name: "STATE_PLATE_NORMALIZE", desc: "Uppercase plate", flag: "FLAG_PLATE_DONE" },
                      { id: 9, name: "STATE_CHECKSUM", desc: "XOR checksum", flag: "FLAG_CHECKSUM_DONE" },
                      { id: 10, name: "STATE_ALERT_CHECK", desc: "Check overtime", flag: "FLAG_ALERT_ACTIVE" },
                      { id: 11, name: "STATE_SELF_TEST", desc: "Validate outputs", flag: "FLAG_SELF_TEST_PASS" },
                      { id: 12, name: "STATE_DONE", desc: "Complete", flag: "FLAG_PROJECT_DONE" },
                      { id: 13, name: "STATE_ERROR", desc: "Error occurred", flag: "FLAG_ERROR" },
                    ].map((row) => (
                      <tr key={row.id} className="border-b border-border/50">
                        <td className="py-2 px-2 text-muted-foreground">{row.id}</td>
                        <td className="py-2 px-2 text-primary">{row.name}</td>
                        <td className="py-2 px-2 text-foreground">{row.desc}</td>
                        <td className="py-2 px-2 text-[oklch(0.75_0.18_165)]">{row.flag}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Bit Counting</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono p-3 bg-secondary/50 rounded overflow-x-auto">
{`uint32_t CountSetBits(uint32_t n)
{
    uint32_t count = 0;
    while(n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}
// 0xA5A5000F -> 12 bits set`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Bubble Sort</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono p-3 bg-secondary/50 rounded overflow-x-auto">
{`for(i = 0; i < n-1; i++) {
    for(j = 0; j < n-i-1; j++) {
        if(arr[j] > arr[j+1]) {
            temp = arr[j];
            arr[j] = arr[j+1];
            arr[j+1] = temp;
        }
    }
}
// Time: O(n²), Space: O(1)`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Fee Calculation</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono p-3 bg-secondary/50 rounded overflow-x-auto">
{`uint32_t CalculateFee(uint32_t min)
{
    // Round up to nearest hour
    uint32_t hrs = (min + 59) / 60;
    return hrs * 20;  // Rs.20/hr
}
// 45 min -> 1 hr -> Rs.20
// 240 min -> 4 hr -> Rs.80`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">XOR Checksum</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono p-3 bg-secondary/50 rounded overflow-x-auto">
{`void GenerateChecksum(void)
{
    xorChecksum = 0;
    for(i = 0; i < 8; i++) {
        xorChecksum ^= parkingMinutes[i];
    }
    xorChecksum ^= occupancyMask;
}
// XOR: a^a=0, a^0=a`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keil" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Keil uVision Setup Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                {[
                  { title: "Step 1: Create Project", items: ["Open Keil uVision 5", "Project → New uVision Project", "Select ARM Cortex M3 device"] },
                  { title: "Step 2: Add Files", items: ["Add main.c, parking_system.c, ui_dashboard.c", "Add header files to include path"] },
                  { title: "Step 3: Configure", items: ["Target: Use Simulator", "Debug: Use Simulator"] },
                  { title: "Step 4: Build & Debug", items: ["Build: F7", "Debug: Ctrl+F5", "Watch Window: View → Watch Windows", "Run: F5"] },
                ].map((step) => (
                  <div key={step.title} className="space-y-2">
                    <h3 className="font-medium text-foreground">{step.title}</h3>
                    <ol className="list-decimal list-inside text-muted-foreground space-y-1 pl-4 text-xs">
                      {step.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ol>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Watch Window Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs font-mono">
                {["systemState", "systemFlags", "occupiedSlots", "freeSlots", "parkingMinutes", "ascendingTime", 
                  "descendingTime", "parkingFee", "totalRevenue", "alertFlag", "projectDone", "uiLine1-8",
                  "uiAutoRun", "uiContinue", "xorChecksum", "eventLog"].map((v) => (
                  <div key={v} className="p-2 bg-secondary/50 rounded">{v}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Expected Outputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {[
                  { var: "occupiedSlots", val: "12" },
                  { var: "freeSlots", val: "20" },
                  { var: "ascendingTime", val: "{15,30,45,60,90,120,180,240}" },
                  { var: "descendingTime", val: "{240,180,120,90,60,45,30,15}" },
                  { var: "longestStay", val: "240" },
                  { var: "shortestStay", val: "15" },
                  { var: "parkingFee", val: "{20,40,20,80,40,20,60,20}" },
                  { var: "totalRevenue", val: "Rs.300" },
                  { var: "normalizedPlate", val: "KA05AB1234" },
                  { var: "alertFlag", val: "1" },
                  { var: "projectDone", val: "1" },
                ].map((row) => (
                  <div key={row.var} className="flex justify-between p-2 bg-secondary/50 rounded">
                    <span className="text-muted-foreground">{row.var}</span>
                    <span className="text-primary">{row.val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viva" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Bit Manipulation", qs: ["How to count set bits?", "Purpose of occupancy mask?", "XOR checksum operation?"] },
              { title: "Sorting", qs: ["Explain bubble sort", "Time complexity?", "Why two arrays?"] },
              { title: "State Machines", qs: ["What is FSM?", "Why use states?", "How do flags work?"] },
              { title: "Embedded C", qs: ["Why volatile keyword?", "Why avoid malloc?", "Role of #define?"] },
              { title: "Fee Calculation", qs: ["Explain fee formula", "Why add 59?", "Minimum charge?"] },
              { title: "Architecture", qs: ["Why multiple files?", "Role of headers?", "How to extend?"] },
            ].map((section) => (
              <Card key={section.title} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-primary">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {section.qs.map((q, i) => (
                      <li key={i}><span className="text-primary">Q{i + 1}:</span> {q}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[oklch(0.8_0.15_85)]" />
                Limitations and Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Limitations</h3>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Simulator only (no hardware)</li>
                    <li>Fixed 8 vehicles</li>
                    <li>No real interrupts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Future Enhancements</h3>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Add LCD display</li>
                    <li>Real interrupt handling</li>
                    <li>UART communication</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
