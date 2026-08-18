# 1. Aşama: Temel resmi imajı seçiyoruz (Node.js sürümü)
FROM node:24-alpine

# 2. Aşama: Konteyner içinde projemizin yaşayacağı klasörü belirliyoruz
WORKDIR /app

# 3. Aşama: Bağımlılık listelerini konteyner içine kopyalıyoruz
COPY package*.json ./

# 4. Aşama: Bağımlılıkları konteyner içinde yüklüyoruz
RUN npm install

# 5. Aşama: Kalan tüm proje dosyalarını konteyner içine kopyalıyoruz
COPY . .

# 6. Aşama: Uygulamanın dış dünyaya açılacağı portu belirtiyoruz
EXPOSE 3000

# 7. Aşama: Projeyi başlatacak komutu yazıyoruz
CMD ["npm", "run", "start:dev"]