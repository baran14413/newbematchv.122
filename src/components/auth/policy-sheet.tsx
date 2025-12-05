'use client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PolicySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: 'terms' | 'privacy';
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="space-y-3 text-muted-foreground text-sm">{children}</div>
    </div>
);

export default function PolicySheet({ isOpen, onOpenChange, initialTab = 'terms' }: PolicySheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-center text-xl">Yasal Bilgiler</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
            <Tabs defaultValue={initialTab} className="h-full flex flex-col">
            <div className="px-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="terms">Kullanım Koşulları</TabsTrigger>
                    <TabsTrigger value="privacy">Gizlilik Politikası</TabsTrigger>
                    <TabsTrigger value="faq">SSS</TabsTrigger>
                </TabsList>
            </div>
            <ScrollArea className="flex-1 mt-4">
                <div className="px-6 pb-6">
                <TabsContent value="terms" className="mt-0">
                    <div className="space-y-6">
                        <Section title="1. Hizmetlerin Kabulü">
                            <p>BeMatch hizmetlerini kullanarak, bu Kullanım Koşullarını kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, hizmetlerimizi kullanmamalısınız.</p>
                        </Section>
                        <Section title="2. Uygunluk">
                            <p>BeMatch'i kullanmak için en az 18 yaşında olmalısınız. Hizmetlerimizi kullanarak 18 yaş ve üzeri olduğunuzu beyan ve garanti edersiniz.</p>
                        </Section>
                        <Section title="3. Topluluk Kuralları">
                            <p>Tüm kullanıcılara saygılı davranmalısınız. Taciz, nefret söylemi, çıplaklık veya yasa dışı faaliyetlere izin verilmez. Bu kuralların ihlali, hesabınızın askıya alınmasına veya silinmesine neden olabilir.</p>
                        </Section>
                         <Section title="4. Sorumluluk Reddi">
                            <p>BeMatch, diğer kullanıcılarla olan etkileşimlerinizden sorumlu değildir. Kendi güvenliğinizden siz sorumlusunuz. Kişisel bilgilerinizi paylaşırken dikkatli olun.</p>
                        </Section>
                    </div>
                </TabsContent>
                <TabsContent value="privacy">
                    <div className="space-y-6">
                        <Section title="1. Topladığımız Bilgiler">
                            <p>Profilinizi oluşturmak için adınız, e-postanız, doğum tarihiniz, fotoğraflarınız ve konumunuz gibi bilgileri toplarız. Bu bilgiler, size daha iyi eşleşmeler sunmak için kullanılır.</p>
                        </Section>
                         <Section title="2. Bilgilerin Kullanımı">
                            <p>Bilgileriniz, hizmetlerimizi sağlamak, geliştirmek ve kişiselleştirmek için kullanılır. Bilgileriniz, izniniz olmadan üçüncü taraflarla pazarlama amacıyla paylaşılmaz.</p>
                        </Section>
                        <Section title="3. Veri Güvenliği">
                            <p>Verilerinizi korumak için endüstri standardı güvenlik önlemleri alıyoruz. Ancak hiçbir sistemin %100 güvenli olmadığını unutmayın.</p>
                        </Section>
                    </div>
                </TabsContent>
                <TabsContent value="faq">
                     <div className="space-y-6">
                        <Section title="BeMatch Gold nedir?">
                            <p>BeMatch Gold, sizi kimlerin beğendiğini görmenizi, sınırsız beğeni hakkı elde etmenizi ve reklamları kaldırmanızı sağlayan premium bir aboneliktir.</p>
                        </Section>
                         <Section title="Hesabımı nasıl silebilirim?">
                            <p>Hesabınızı silmek için 'Ayarlar' menüsündeki 'Gizlilik ve Güvenlik' bölümüne gidebilirsiniz. Bu işlemin geri alınamayacağını unutmayın.</p>
                        </Section>
                        <Section title="Bir kullanıcıyı nasıl şikayet edebilirim?">
                            <p>Bir kullanıcının profilindeki menüden 'Şikayet Et' seçeneğini kullanarak uygunsuz davranışları bize bildirebilirsiniz.</p>
                        </Section>
                    </div>
                </TabsContent>
                </div>
            </ScrollArea>
            </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
