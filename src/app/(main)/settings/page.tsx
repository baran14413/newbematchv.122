import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { zodiacSigns } from "@/lib/data";

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-primary">Control Center</h1>
        <p className="text-muted-foreground">Fine-tune your Nexus experience.</p>
      </header>

      <Card className="bg-card/60 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Manage your visibility on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="incognito-mode">Incognito Mode</Label>
              <p className="text-sm text-muted-foreground">
                Only be shown to people you've liked.
              </p>
            </div>
            <Switch id="incognito-mode" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle>Advanced Filters</CardTitle>
          <CardDescription>Specify who you're looking for.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <Label>Height</Label>
                <span className="text-sm text-muted-foreground">5'4" - 6'2"</span>
            </div>
            <Slider defaultValue={[162, 188]} min={140} max={210} step={1} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <Label>Distance</Label>
                <span className="text-sm text-muted-foreground">50 mi</span>
            </div>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-4">
            <Label>Zodiac Sign</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {zodiacSigns.map((sign) => (
                  <SelectItem key={sign} value={sign.toLowerCase()}>{sign}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle>Theme Engine</CardTitle>
          <CardDescription>Customize your app's look and feel.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-black border-2 border-primary">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
            </div>
            <Label>Midnight Luxury</Label>
          </div>
           <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-indigo-900 border-2 border-orange-400">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
            </div>
            <Label>Sunset Vibes</Label>
          </div>
           <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-blue-900 border-2 border-cyan-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-300 to-green-300" />
            </div>
            <Label>Ocean Blue</Label>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
