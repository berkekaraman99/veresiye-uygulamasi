# --- 1. AŞAMA: Projeyi Derleme (Build) ---
FROM node:22-alpine AS build-stage

# Konteyner içindeki çalışma dizini
WORKDIR /app

# Bağımlılık dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# Üretim ortamı için build al (dist klasörü oluşur)
RUN npm run build


# --- 2. AŞAMA: Canlıya Alma (Production) ---
FROM nginx:stable-alpine AS production-stage

# İlk aşamada oluşan 'dist' klasörünü Nginx'in HTML yayınladığı klasöre kopyala
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Eğer Vue Router kullanıyorsanız ve 'history' modundaysanız 
# sayfa yenilemelerinde 404 hatası almamak için Nginx konfigürasyonunu kopyalıyoruz
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx standart olarak 80 portunda çalışır
EXPOSE 80

# Nginx sunucusunu başlat
CMD ["nginx", "-g", "daemon off;"]