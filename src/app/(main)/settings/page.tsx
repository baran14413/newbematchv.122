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
        <h1 className="text-3xl font-bold text-primary">Kontrol Merkezi</h1>
        <p className="text-muted-foreground">BeMatch deneyimini kendine göre ayarla.</p>
      </header>

      <Card className="bg-card/60 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle>Gizlilik</CardTitle>
          <CardDescription>Platformdaki görünürlüğünü yönet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="incognito-mode">Gizli Mod</Label>
              <p className="text-sm text-muted-foreground">
                Sadece beğendiğin kişilere gösteril.
              </p>
            </div>
            <Switch id="incognito-mode" />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="show-profile">Profili Göster</Label>
              <p className="text-sm text-muted-foreground">
                Profilinin BeMatch'te görünmesini engelle.
              </p>
            </div>
            <Switch id="show-profile" defaultChecked/>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/60 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle>Keşfet Ayarları</CardTitle>
          <CardDescription>Kimi aradığını belirt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
           <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <Label>Mesafe</Label>
                <span className="text-sm text-muted-foreground">80 km</span>
            </div>
            <Slider defaultValue={[80]} max={150} step={1} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <Label>Yaş Aralığı</Label>
                <span className="text-sm text-muted-foreground">25 - 35</span>
            </div>
            <Slider defaultValue={[25, 35]} min={18} max={65} step={1} />
          </div>
          <div className="space-y-4">
            <Label>Burç</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Farketmez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Farketmez</SelectItem>
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
          <CardTitle>Bildirimler</CardTitle>
          <CardDescription>Hangi bildirimleri almak istediğini seç.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">Anlık Bildirimler</Label>
                <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">E-posta Bildirimleri</Label>
                <Switch id="email-notifications" />
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
