import { navItems } from '../data/navigation';
import { kelurahanInfo } from '../data/kelurahanInfo';
import { pejabatList } from '../data/pejabat';
import { potensiList } from '../data/potensi';
import { beritaList } from '../data/berita';
import { agendaList } from '../data/agenda';
import { galeriList, galeriKategori } from '../data/galeri';
import { layananList } from '../data/layanan';
import { statsData, programList, testimonialList } from '../data/beranda';
import type {
  NavItem, KelurahanInfo, Pejabat, Potensi, Berita, Agenda,
  GaleriItem, Layanan, StatItem, ProgramItem, TestimonialItem,
} from '../types';

export const dataService = {
  getNavItems(): NavItem[] {
    return navItems;
  },
  getKelurahanInfo(): KelurahanInfo {
    return kelurahanInfo;
  },
  getPejabatList(): Pejabat[] {
    return pejabatList;
  },
  getPotensiList(): Potensi[] {
    return potensiList;
  },
  getBeritaList(): Berita[] {
    return beritaList;
  },
  getBeritaById(id: number): Berita | undefined {
    return beritaList.find((b) => b.id === id);
  },
  getAgendaList(): Agenda[] {
    return agendaList;
  },
  getUpcomingAgenda(): Agenda[] {
    return agendaList.filter((a) => a.status === 'upcoming');
  },
  getGaleriList(): GaleriItem[] {
    return galeriList;
  },
  getGaleriKategori(): string[] {
    return galeriKategori;
  },
  getLayananList(): Layanan[] {
    return layananList;
  },
  getLayananById(id: number): Layanan | undefined {
    return layananList.find((l) => l.id === id);
  },
  getStatsData(): StatItem[] {
    return statsData;
  },
  getProgramList(): ProgramItem[] {
    return programList;
  },
  getTestimonialList(): TestimonialItem[] {
    return testimonialList;
  },
};
