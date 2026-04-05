import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const INSTAGRAM_USERNAME = "tocorimerio";

const embeddedPosts = [
  `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DGs123456789/" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5); padding:0; margin:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DGs123456789/" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-left:8px; margin-right:8px; margin-top:8px; overflow:hidden; padding:2px 0 0; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><span style=" color:#000; font-size:14px; font-weight:600;">Ver esta publicação no Instagram</span></p></a></div></blockquote>`,
  `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DGs987654321/" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5); padding:0; margin:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DGs987654321/" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-left:8px; margin-right:8px; margin-top:8px; overflow:hidden; padding:2px 0 0; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><span style=" color:#000; font-size:14px; font-weight:600;">Ver esta publicação no Instagram</span></p></a></div></blockquote>`,
  `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DGs555555555/" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5); padding:0; margin:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DGs555555555/" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-left:8px; margin-right:8px; margin-top:8px; overflow:hidden; padding:2px 0 0; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><span style=" color:#000; font-size:14px; font-weight:600;">Ver esta publicação no Instagram</span></p></a></div></blockquote>`,
  `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DGs333333333/" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5); padding:0; margin:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DGs333333333/" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-left:8px; margin-right:8px; margin-top:8px; overflow:hidden; padding:2px 0 0; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><span style=" color:#000; font-size:14px; font-weight:600;">Ver esta publicação no Instagram</span></p></a></div></blockquote>`,
  `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DGs111111111/" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5); padding:0; margin:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DGs111111111/" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-left:8px; margin-right:8px; margin-top:8px; overflow:hidden; padding:2px 0 0; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><span style=" color:#000; font-size:14px; font-weight:600;">Ver esta publicação no Instagram</span></p></a></div></blockquote>`,
];

export function InstagramCarousel() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="w-6 h-6 text-primary" />
            <p className="text-primary font-medium font-sans">@{INSTAGRAM_USERNAME}</p>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Sigue-nos no Instagram
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            Veja nossas últimas aventuras e fotos dos nossos passeios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {embeddedPosts.map((embed, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl overflow-hidden border border-border/50 p-0"
              dangerouslySetInnerHTML={{ __html: embed }}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="font-sans">
              <Instagram className="w-4 h-4 mr-2" />
              Ver mais no Instagram
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
