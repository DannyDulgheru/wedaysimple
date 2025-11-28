import { 
  getVisibleSections, 
  getAllTimelineEvents, 
  getAllWeddingPartyMembers, 
  getAllGalleryImages, 
  getAllFAQs 
} from '@/lib/db/queries';
import { HeroSection } from '@/components/sections/HeroSection';
import { CoupleIntroSection } from '@/components/sections/CoupleIntroSection';
import { OurStorySection } from '@/components/sections/OurStorySection';
import { CeremonySection } from '@/components/sections/CeremonySection';
import { ReceptionSection } from '@/components/sections/ReceptionSection';
import { ScheduleSection } from '@/components/sections/ScheduleSection';
import { WeddingPartySection } from '@/components/sections/WeddingPartySection';
import { GallerySection } from '@/components/sections/GallerySection';
import { AccommodationsSection } from '@/components/sections/AccommodationsSection';
import { RegistrySection } from '@/components/sections/RegistrySection';
import { RSVPSection } from '@/components/sections/RSVPSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { FooterSection } from '@/components/sections/FooterSection';

export const dynamic = 'force-dynamic';

export default function Home() {
  const sections = getVisibleSections() as any[];
  const timelineEvents = getAllTimelineEvents() as any[];
  const weddingParty = getAllWeddingPartyMembers() as any[];
  const galleryImages = getAllGalleryImages() as any[];
  const faqs = getAllFAQs() as any[];

  const sectionComponents: { [key: string]: any } = {
    hero: HeroSection,
    couple_intro: CoupleIntroSection,
    our_story: OurStorySection,
    ceremony: CeremonySection,
    reception: ReceptionSection,
    schedule: ScheduleSection,
    wedding_party: WeddingPartySection,
    gallery: GallerySection,
    accommodations: AccommodationsSection,
    registry: RegistrySection,
    rsvp: RSVPSection,
    faq: FAQSection,
    footer: FooterSection,
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {sections.map((section: any) => {
        const SectionComponent = sectionComponents[section.section_key];
        if (!SectionComponent) return null;

        const content = JSON.parse(section.content_json || '{}');

        // Pass additional data based on section type
        const extraProps: any = {};
        if (section.section_key === 'our_story') {
          extraProps.timelineEvents = timelineEvents;
        }
        if (section.section_key === 'wedding_party') {
          extraProps.members = weddingParty;
        }
        if (section.section_key === 'gallery') {
          extraProps.images = galleryImages;
        }
        if (section.section_key === 'faq') {
          extraProps.faqs = faqs;
        }

        return (
          <SectionComponent
            key={section.id}
            content={content}
            {...extraProps}
          />
        );
      })}
    </div>
  );
}
