import type { QuizQuestion } from '../types/game';

export interface SourceReference {
  id: string;
  label: string;
  href: string;
}

export const sourceReferences: SourceReference[] = [
  {
    id: 'mln-textbook',
    label: 'Bộ GD&ĐT, Giáo trình Kinh tế chính trị Mác - Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    href: 'https://www.nxbctqg.org.vn/giao-trinh-kinh-te-chinh-tri-mac-lenin-danh-cho-bac-dai-hoc-he-khong-chuyen-ly-luan-chinh-tri-.html',
  },
  {
    id: 'lenin-imperialism',
    label: 'V.I. Lenin, Imperialism, the Highest Stage of Capitalism, 1916',
    href: 'https://www.marxists.org/archive/lenin/works/1916/imp-hsc/',
  },
  {
    id: 'oecd-digital-market-power',
    label: 'OECD, The evolving concept of market power in the digital economy, 2022',
    href: 'https://one.oecd.org/document/DAF/COMP%282022%295/en/pdf',
  },
  {
    id: 'eu-dma',
    label: 'European Union, Digital Markets Act, Regulation (EU) 2022/1925',
    href: 'https://eur-lex.europa.eu/eli/reg/2022/1925/oj/eng',
  },
  {
    id: 'eu-dsa',
    label: 'European Union, Digital Services Act, Regulation (EU) 2022/2065',
    href: 'https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng',
  },
  {
    id: 'doj-google-adtech',
    label: 'U.S. Department of Justice, U.S. and Plaintiff States v. Google LLC, digital advertising technology case',
    href: 'https://www.justice.gov/atr/case/us-and-plaintiff-states-v-google-llc-2023',
  },
  {
    id: 'doj-google-search',
    label: 'U.S. Department of Justice, United States et al. v. Google, online search monopolization case',
    href: 'https://www.justice.gov/opa/pr/department-justice-wins-significant-remedies-against-google',
  },
  {
    id: 'standard-oil-1911',
    label: 'Standard Oil Co. of New Jersey v. United States, 221 U.S. 1 (1911)',
    href: 'https://supreme.justia.com/cases/federal/us/221/1/',
  },
];

const sourceReferencesByTopic: Record<QuizQuestion['topic'], string[]> = {
  monopoly: ['mln-textbook', 'lenin-imperialism'],
  'capital-accumulation': ['mln-textbook'],
  'capital-centralization': ['mln-textbook', 'lenin-imperialism'],
  'resource-monopoly': ['mln-textbook', 'lenin-imperialism'],
  'data-monopoly': ['oecd-digital-market-power', 'eu-dma'],
  'network-effect': ['oecd-digital-market-power'],
  'market-entry': ['oecd-digital-market-power', 'eu-dma'],
  'ai-data': ['oecd-digital-market-power'],
  'historic-limit': ['mln-textbook', 'lenin-imperialism', 'oecd-digital-market-power'],
};

export function getSourceReferencesByIds(ids: string[]): SourceReference[] {
  return ids
    .map((id) => sourceReferences.find((source) => source.id === id))
    .filter((source): source is SourceReference => Boolean(source));
}

export function getSourceReferencesForTopic(topic: QuizQuestion['topic']): SourceReference[] {
  return getSourceReferencesByIds(sourceReferencesByTopic[topic] ?? []);
}
