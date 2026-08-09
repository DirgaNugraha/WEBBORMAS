/**
 * Barrel / facade untuk seluruh layanan domain.
 * Halaman publik cukup mengimpor `dataService` seperti sebelumnya,
 * namun implementasi kini terpecah per domain (lebih mudah dirawat).
 */
import { beritaService } from './beritaService';
import { galeriService } from './galeriService';
import { agendaService } from './agendaService';
import { profilService } from './profilService';
import { potensiService } from './potensiService';
import { layananService } from './layananService';
import { statistikService } from './statistikService';

export const dataService = {
  // Profil kelurahan & pejabat
  getKelurahanInfo: profilService.getKelurahanInfo.bind(profilService),
  getPejabatList: profilService.getPejabatList.bind(profilService),

  // Berita
  getBeritaList: beritaService.getBeritaList.bind(beritaService),
  getBeritaPage: beritaService.getBeritaPage.bind(beritaService),
  getBeritaById: beritaService.getBeritaById.bind(beritaService),
  getBeritaBySlug: beritaService.getBeritaBySlug.bind(beritaService),
  getRecentBerita: beritaService.getRecentBerita.bind(beritaService),

  // Agenda
  getAgendaList: agendaService.getAgendaList.bind(agendaService),
  getAgendaPage: agendaService.getAgendaPage.bind(agendaService),
  getUpcomingAgenda: agendaService.getUpcomingAgenda.bind(agendaService),
  getRecentAgenda: agendaService.getRecentAgenda.bind(agendaService),

  // Galeri
  getGaleriList: galeriService.getGaleriList.bind(galeriService),
  getGaleriPage: galeriService.getGaleriPage.bind(galeriService),
  getGaleriKategori: galeriService.getGaleriKategori.bind(galeriService),
  getRecentGaleri: galeriService.getRecentGaleri.bind(galeriService),

  // Layanan publik
  getLayananList: layananService.getLayananList.bind(layananService),
  getLayananById: layananService.getLayananById.bind(layananService),

  // Potensi
  getPotensiList: potensiService.getPotensiList.bind(potensiService),
  getPotensiInfografis: potensiService.getPotensiInfografis.bind(potensiService),

  // Statistik & program
  getStatsData: statistikService.getStatsData.bind(statistikService),
  getProgramList: statistikService.getProgramList.bind(statistikService),
};
