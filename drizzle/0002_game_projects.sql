CREATE TABLE "game_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"store" text NOT NULL,
	"youtube_url" text NOT NULL,
	"tebex_url" text,
	"description_tr" text NOT NULL,
	"description_en" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
-- Initial rows live in the migration (not seed.ts) so existing databases, local and Neon, get them too.
-- DRAFT: descriptions.
INSERT INTO "game_projects" ("name", "store", "youtube_url", "tebex_url", "description_tr", "description_en", "sort_order") VALUES
('Marriage V2', '0Resmon', 'https://www.youtube.com/watch?v=UYbTJGIbblI', 'https://0resmon.tebex.io/package/7654846', 'Oyuncuların evlilik teklif edip nikâh töreni düzenleyebildiği evlilik sistemi.', 'A marriage system where players can propose and hold a wedding ceremony.', 0),
('Trucker Job V2', '0Resmon', 'https://www.youtube.com/watch?v=-Owr5kznK5w', 'https://0resmon.tebex.io/package/0r-multiplayer-trucker-job-3-different-missions-cargo-container-vehicle-escrow', 'Kargo, konteyner ve araç taşıma olmak üzere üç görev tipine sahip, çok oyunculu tır şoförlüğü mesleği.', 'A multiplayer trucking job with three mission types: cargo, container and vehicle transport.', 1),
('Forklift Job', '0Resmon', 'https://www.youtube.com/watch?v=2Ahq3SYcyms', 'https://0resmon.tebex.io/package/7282736', 'Depoda forklift ile yük taşıma görevleri sunan meslek scripti.', 'A job script built around forklift cargo-handling tasks in a warehouse.', 2),
('Nail Studio', '0Resmon', 'https://www.youtube.com/watch?v=G3s4IyYNP1M', 'https://0resmon.tebex.io/package/7135184', 'Oyuncuların manikür ve tırnak tasarımı yaptırabildiği tırnak salonu.', 'A nail salon where players can get manicures and nail designs.', 3),
('Towtruck v2', '0Resmon', 'https://www.youtube.com/watch?v=GKOI-N5vfAs', 'https://0resmon.tebex.io/package/0r-towtruck-escrow', 'Arızalı ve hatalı park edilmiş araçları çekip taşıyan çekici mesleği.', 'A tow truck job for hauling broken-down and illegally parked vehicles.', 4),
('VehicleKeys', '0Resmon', 'https://www.youtube.com/watch?v=XPlkZHj9ZiM', NULL, 'Araç anahtarı, kilitleme ve anahtar paylaşımı sistemi.', 'A vehicle key system with locking and key sharing.', 5),
('Loading Screen v3', '0Resmon', 'https://www.youtube.com/watch?v=9trvR7odgWw', 'https://0resmon.tebex.io/package/7033082', 'Sunucuya bağlanırken gösterilen, özelleştirilebilir yükleme ekranı.', 'A customizable loading screen shown while players join the server.', 6),
('Fishing v2', '0Resmon', 'https://www.youtube.com/watch?v=HvZMP1kyRQY', 'https://0resmon.tebex.io/package/0r-fishing-escrow', 'Balık tutma, ekipman ve satış döngüsüne sahip balıkçılık scripti.', 'A fishing script with a catch, gear and sell loop.', 7),
('Multicharacter v3', '0Resmon', 'https://www.youtube.com/watch?v=ocD6P0vxCPM', 'https://0resmon.tebex.io/package/0r-ingame-customizable-multicharacter-all-in-one-escrow', 'Oyun içinden özelleştirilebilen, hepsi bir arada karakter seçme ve oluşturma ekranı.', 'An all-in-one character selection and creation screen, customizable in game.', 8),
('Chat v3', '0Resmon', 'https://www.youtube.com/watch?v=MHgN_ElzpNk', NULL, 'Sunucu için yeniden tasarlanmış oyun içi sohbet arayüzü.', 'A redesigned in-game chat interface.', 9),
('GPS V2', '0Resmon', 'https://www.youtube.com/watch?v=0djUIR-8ojQ', NULL, 'Konum işaretleme ve rota oluşturmaya yönelik GPS arayüzü.', 'A GPS interface for marking locations and setting routes.', 10),
('Multiplayer House Robbery', '0Resmon', 'https://www.youtube.com/watch?v=DeG3D2bpkXU', 'https://0resmon.tebex.io/package/6860619', 'Oyuncuların birlikte ev soygunu yapabildiği çok oyunculu soygun scripti.', 'A multiplayer heist where players rob houses together.', 11),
('Manageable Casino', '0Resmon', 'https://www.youtube.com/watch?v=M264fSDZgJo', NULL, 'Oyuncular tarafından işletilip yönetilebilen kumarhane sistemi.', 'A casino that players can own and manage.', 12),
('Multicharacter v2', '0Resmon', 'https://www.youtube.com/watch?v=Qsly1fIwgaU', NULL, 'Karakter seçme ve oluşturma ekranının ikinci sürümü.', 'The second version of the character selection and creation screen.', 13),
('RCCar', '0Resmon', 'https://www.youtube.com/watch?v=TFheZj2Ggok', 'https://0resmon.tebex.io/package/0r-rccar-remote-control-car-escrow', 'Uzaktan kumandayla sürülen oyuncak araba scripti.', 'A remote-controlled toy car script.', 14),
('Dailyrewards', '0Resmon', 'https://www.youtube.com/watch?v=gkzoUVzqHsY', NULL, 'Her gün giriş yapan oyuncuları ödüllendiren günlük ödül sistemi.', 'A daily reward system that rewards players for logging in every day.', 15),
('Repair Kit', '0Resmon', 'https://www.youtube.com/watch?v=vbDFIsJ-JLc', NULL, 'Araçları yolda onarmak için kullanılan tamir kiti.', 'A repair kit for fixing vehicles on the road.', 16),
('Battlepass', 'WASD', 'https://www.youtube.com/watch?v=LuFw4VEsnhA', 'https://wasdstore.tebex.io/package/7058060', 'Görevler ve seviye ödülleri içeren sezonluk battle pass sistemi.', 'A seasonal battle pass with missions and tier rewards.', 17),
('Fishing', 'WASD', 'https://www.youtube.com/watch?v=PQ3bp16nkZo', 'https://wasdstore.tebex.io/package/fishing', 'Kendine ait arayüzü olan balıkçılık mesleği.', 'A fishing job with its own interface.', 18),
('Garages V3', 'FastScript', 'https://www.youtube.com/watch?v=Hv9m6i13A2U', 'https://fastscripts.tebex.io/package/7713843', 'Araçları saklayıp çıkarmak için garaj sistemi.', 'A garage system for storing and retrieving vehicles.', 19),
('Tuner Shop', 'FastScript', 'https://www.youtube.com/watch?v=-nyV0TTE1Ac', 'https://fastscripts.tebex.io/package/7705389', 'Araç modifiye ve tuning atölyesi.', 'A vehicle tuning and modification shop.', 20),
('Trucker Job', 'FastScript', 'https://www.youtube.com/watch?v=OgB91fvgJtY', 'https://fastscripts.tebex.io/package/6924659', 'Teslimat görevleriyle tır şoförlüğü mesleği.', 'A trucking job built around delivery missions.', 21),
('Fishing', 'FastScript', 'https://www.youtube.com/watch?v=RNrR5mKlaG4', 'https://fastscripts.tebex.io/package/7705409', 'Balık tutup satabileceğin balıkçılık scripti.', 'A fishing script for catching and selling fish.', 22),
('Daily Gifting', 'FastScript', 'https://www.youtube.com/watch?v=esKnFgxSSDA', 'https://fastscripts.tebex.io/package/7705397', 'Oyunculara her gün hediye veren günlük hediye sistemi.', 'A daily gift system that hands players a reward every day.', 23),
('Multicharacter v2', 'FastScript', 'https://www.youtube.com/watch?v=M8LY_cSJFO0', 'https://fastscripts.tebex.io/package/7705411', 'Karakter seçme ve oluşturma ekranı.', 'A character selection and creation screen.', 24),
('CarPlay', 'FastScript', 'https://www.youtube.com/watch?v=A9AGRkgtfEc', 'https://fastscripts.tebex.io/package/7705396', 'Araç içinde müzik ve navigasyon sunan CarPlay arayüzü.', 'An in-car CarPlay-style interface for music and navigation.', 25);
