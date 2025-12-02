import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser, profiles } from "@/lib/data";
import CompatibilityRadar from "@/components/profile/compatibility-radar";
import { placeholderImages } from "@/lib/data";
import Image from "next/image";

export default function ProfilePage() {
  // For demonstration, we'll compare the current user to the first profile
  const viewingProfile = profiles[0];
  const userAvatar = placeholderImages.find(p => p.id === 'user-2-avatar');

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 space-y-8">
      <header className="flex items-center gap-6">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary">
          {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="Current User" />}
          <AvatarFallback className="text-4xl">YOU</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Alex, 31</h1>
          <p className="text-lg text-muted-foreground">Software Engineer</p>
        </div>
      </header>
      
      <Card className="bg-card/60 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle>Vibe Check</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            How your personality vibes with {viewingProfile.name}'s.
          </p>
          <CompatibilityRadar 
            currentUserTraits={currentUser.personalityTraits} 
            viewerProfileTraits={viewingProfile.personalityTraits}
          />
        </CardContent>
      </Card>

       <Card className="bg-card/60 backdrop-blur-md border-border">
        <CardHeader>
          <CardTitle>Photo Gallery</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profiles[1].imageUrls.map((url, index) => (
             <div key={index} className="aspect-square relative rounded-lg overflow-hidden border-2 border-primary/20">
                <Image src={url} alt={`Gallery image ${index + 1}`} fill className="object-cover"/>
             </div>
          ))}
           <div className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50 text-muted-foreground">
             <span>Add Photo</span>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
