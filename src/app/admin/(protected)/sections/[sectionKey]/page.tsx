import { notFound } from 'next/navigation';
import HeroEditor from './editors/HeroEditor';
import CoupleIntroEditor from './editors/CoupleIntroEditor';
import OurStoryEditor from './editors/OurStoryEditor';
import CeremonyEditor from './editors/CeremonyEditor';
import ReceptionEditor from './editors/ReceptionEditor';
import ScheduleEditor from './editors/ScheduleEditor';
import WeddingPartyEditor from './editors/WeddingPartyEditor';
import GalleryEditor from './editors/GalleryEditor';
import AccommodationsEditor from './editors/AccommodationsEditor';
import RegistryEditor from './editors/RegistryEditor';
import RSVPEditor from './editors/RSVPEditor';
import FAQEditor from './editors/FAQEditor';
import FooterEditor from './editors/FooterEditor';

const editorComponents: { [key: string]: any } = {
  hero: HeroEditor,
  couple_intro: CoupleIntroEditor,
  our_story: OurStoryEditor,
  ceremony: CeremonyEditor,
  reception: ReceptionEditor,
  schedule: ScheduleEditor,
  wedding_party: WeddingPartyEditor,
  gallery: GalleryEditor,
  accommodations: AccommodationsEditor,
  registry: RegistryEditor,
  rsvp: RSVPEditor,
  faq: FAQEditor,
  footer: FooterEditor,
};

interface PageProps {
  params: Promise<{
    sectionKey: string;
  }>;
}

export default async function SectionEditPage({ params }: PageProps) {
  const { sectionKey } = await params;
  
  const EditorComponent = editorComponents[sectionKey];
  
  if (!EditorComponent) {
    notFound();
  }

  return <EditorComponent sectionKey={sectionKey} />;
}
