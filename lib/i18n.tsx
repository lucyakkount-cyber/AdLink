"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type Locale = "uz" | "ru"

type Translations = {
  [key: string]: {
    uz: string
    ru: string
  }
}

export const t: Translations = {
  // Header
  "nav.business": { uz: "Biznes", ru: "Бизнес" },
  "nav.blogger": { uz: "Bloger", ru: "Блогер" },
  "nav.start": { uz: "Boshlash", ru: "Начать" },
  "nav.menu": { uz: "Menyuni ochish", ru: "Открыть меню" },
  "nav.profile": { uz: "Profil", ru: "Профиль" },
  "nav.orders": { uz: "Buyurtmalar", ru: "Заказы" },
  "nav.back": { uz: "Orqaga", ru: "Назад" },
  "nav.logout": { uz: "Chiqish", ru: "Выйти" },

  // Auth
  "auth.login.title": { uz: "Kirish", ru: "Вход" },
  "auth.login.subtitle": {
    uz: "Biznes yoki bloger sahifangizga o'tish uchun tizimga kiring.",
    ru: "Войдите, чтобы продолжить на страницы бизнеса или блогера.",
  },

  // Common
  "common.error_title": { uz: "Xatolik", ru: "Ошибка" },
  "common.saved_title": { uz: "✅ Saqlandi!", ru: "✅ Сохранено!" },
  "common.save": { uz: "Saqlash", ru: "Сохранить" },
  "common.saving": { uz: "Saqlanmoqda...", ru: "Сохраняем..." },
  "common.cancel": { uz: "Bekor qilish", ru: "Отмена" },
  "common.edit": { uz: "Tahrirlash", ru: "Редактировать" },
  "common.all": { uz: "Barchasi", ru: "Все" },
  "common.not_allowed_title": { uz: "Ruxsat berilmagan", ru: "Нет доступа" },
  "common.not_set": { uz: "Belgilanmagan", ru: "Не указано" },
  "common.not_specified": { uz: "Ko'rsatilmagan", ru: "Не указано" },
  "common.unknown": { uz: "Noma'lum", ru: "Неизвестно" },
  "common.save_failed": { uz: "Saqlab bo'lmadi", ru: "Не удалось сохранить" },
  "auth.signup.title": { uz: "Akkaunt yaratish", ru: "Создать аккаунт" },
  "auth.signup.subtitle": {
    uz: "Biznes va bloger sahifalariga kirish uchun akkaunt yarating.",
    ru: "Создайте аккаунт, чтобы получить доступ к страницам бизнеса и блогера.",
  },
  "auth.account_required.title": { uz: "Akkaunt kerak", ru: "Нужен аккаунт" },
  "auth.account_required.desc": {
    uz: "Bu sahifaga kirish uchun avval akkaunt yarating.",
    ru: "Чтобы открыть эту страницу, сначала создайте аккаунт.",
  },
  "auth.auth_required.desc": {
    uz: "Davom etish uchun tizimga kiring.",
    ru: "Пожалуйста, войдите, чтобы продолжить.",
  },
  "auth.email": { uz: "Email", ru: "Email" },
  "auth.password": { uz: "Parol", ru: "Пароль" },
  "auth.login.button": { uz: "Kirish", ru: "Войти" },
  "auth.login.loading": { uz: "Kirilmoqda...", ru: "Входим..." },
  "auth.signup.button": { uz: "Akkaunt yaratish", ru: "Создать аккаунт" },
  "auth.signup.loading": { uz: "Yaratilmoqda...", ru: "Создаём..." },
  "auth.no_account": { uz: "Akkauntingiz yo'qmi?", ru: "Нет аккаунта?" },
  "auth.have_account": { uz: "Akkauntingiz bormi?", ru: "Уже есть аккаунт?" },
  "auth.create_one": { uz: "Yaratish", ru: "Создать" },
  "auth.go_login": { uz: "Kirish", ru: "Войти" },
  "auth.account_type": { uz: "Akkaunt turi", ru: "Тип аккаунта" },
  "auth.account_type.placeholder": { uz: "Turini tanlang", ru: "Выберите тип" },
  "auth.role.business": { uz: "Biznes", ru: "Бизнес" },
  "auth.role.blogger": { uz: "Bloger", ru: "Блогер" },
  "auth.error.login": { uz: "Kirish amalga oshmadi", ru: "Не удалось войти" },
  "auth.error.signup": { uz: "Akkaunt yaratib bo'lmadi", ru: "Не удалось создать аккаунт" },

  // Profile page
  "profile_page.title": { uz: "Profil", ru: "Профиль" },
  "profile_page.subtitle": {
    uz: "Ma'lumotlaringizni to'ldiring va tahrirlang",
    ru: "Заполните и редактируйте ваши данные",
  },
  "profile_page.save": { uz: "Saqlash", ru: "Сохранить" },
  "profile_page.saving": { uz: "Saqlanmoqda...", ru: "Сохраняем..." },
  "profile_page.saved": { uz: "Saqlandi!", ru: "Сохранено!" },
  "profile_page.error": { uz: "Xatolik yuz berdi", ru: "Произошла ошибка" },

  // Business profile fields
  "business.company_name": { uz: "Kompaniya nomi", ru: "Название компании" },
  "business.niche": { uz: "Nisha", ru: "Ниша" },
  "business.budget_min": { uz: "Minimal byudjet", ru: "Минимальный бюджет" },
  "business.budget_max": { uz: "Maksimal byudjet", ru: "Максимальный бюджет" },

  // Hero
  "hero.badge": { uz: "AI texnologiyasi \u00B7 Hackathon MVP", ru: "AI технология \u00B7 Hackathon MVP" },
  "hero.title1": { uz: "AdLink \u2014 bloger toping", ru: "AdLink \u2014 найди блогера" },
  "hero.title2": { uz: "va reklamani 3 soniyada yarating", ru: "и сгенерируй рекламу за 3 секунды" },
  "hero.description": {
    uz: "O\u2018zbekiston kichik biznesi uchun platforma: AI Telegram, Instagram va TikTok\u2019da blogerlarni tanlaydi va har bir inflyuenser uchun shaxsiy reklama posti yozadi.",
    ru: "Платформа для малого бизнеса Узбекистана: AI подбирает блогеров в Telegram, Instagram и TikTok, и сразу пишет рекламный пост \u2014 персонально под каждого инфлюенсера.",
  },
  "hero.cta_business": { uz: "Men biznesman \u2014 bloger topish", ru: "Я бизнес \u2014 найти блогеров" },
  "hero.cta_blogger": { uz: "Men bloger \u2014 profil yaratish", ru: "Я блогер \u2014 создать профиль" },

  // Problem section
  "problem.label": { uz: "Muammo", ru: "Проблема" },
  "problem.title": { uz: "Bloger izlash \u2014 bu kunlar davomida yozishmalar va xatolar", ru: "Поиск блогера \u2014 это дни переписки и ошибок" },
  "problem.1": { uz: "O\u2018zbek blogerlarning yagona bazasi yo\u2018q", ru: "Нет единой базы узбекских блогеров" },
  "problem.2": { uz: "Kim byudjet va nishaga mos kelishini tushunish qiyin", ru: "Непонятно, кто подходит под бюджет и нишу" },
  "problem.3": { uz: "Jalb qiluvchi post yozish qiyin va uzoq davom etadi", ru: "Написать цепляющий пост трудно и долго" },
  "problem.4": { uz: "Nakrutka va botlar \u2014 raqamlarga ishonib bo\u2018lmaydi", ru: "Накрутки и боты \u2014 нельзя доверять цифрам" },

  "solution.label": { uz: "AdLink yechimi", ru: "Решение AdLink" },
  "solution.title": { uz: "AI hammasini bir necha soniyada bajaradi", ru: "AI делает всё за вас за секунды" },
  "solution.1": { uz: "O\u2018zbekiston bo\u2018ylab tasdiqlangan blogerlar bazasi", ru: "База верифицированных блогеров Узбекистана" },
  "solution.2": { uz: "Byudjet, nisha va platforma bo\u2018yicha aqlli filter", ru: "Умный фильтр по бюджету, нише и платформе" },
  "solution.3": { uz: "GPT-4 har bir bloger uchun alohida post yozadi", ru: "GPT-4 генерирует пост отдельно под каждого блогера" },
  "solution.4": { uz: "Reyting, statistika va bevosita kontaktlar", ru: "Рейтинг, статистика и прямые контакты" },

  // Features
  "features.label": { uz: "Imkoniyatlar", ru: "Возможности" },
  "features.title": { uz: "Reklama uchun kerak bo\u2018lgan hamma narsa", ru: "Всё, что нужно для рекламы" },
  "features.ai.title": { uz: "AI bloger tanlash", ru: "AI подбор блогера" },
  "features.ai.desc": { uz: "Algoritm byudjet, nisha va maqsadlaringizni tahlil qilib, ideal blogerlarni tanlaydi.", ru: "Алгоритм анализирует ваш бюджет, нишу и цели, чтобы подобрать идеальных блогеров." },
  "features.text.title": { uz: "Reklama posti yaratish", ru: "Генерация рекламного поста" },
  "features.text.desc": { uz: "GPT-4 har bir bloger uslubiga mos jalb qiluvchi post yozadi \u2014 o\u2018zbek yoki rus tilida.", ru: "GPT-4 пишет цепляющий пост под стиль каждого блогера на русском или узбекском языке." },
  "features.platforms.title": { uz: "Telegram \u00B7 Instagram \u00B7 TikTok", ru: "Telegram \u00B7 Instagram \u00B7 TikTok" },
  "features.platforms.desc": { uz: "O\u2018zbekistondagi barcha mashhur platformalar bir joyda. Kerakli auditoriyani qamrab oling.", ru: "Все популярные платформы в Узбекистане в одном месте. Охватите нужную аудиторию." },
  "features.analytics.title": { uz: "Shaffof analitika", ru: "Прозрачная аналитика" },
  "features.analytics.desc": { uz: "Auditoriya, post narxi va bloger reytingini ko\u2018ring \u2014 yashirin komissiyalar yo\u2018q.", ru: "Видите аудиторию, цену за пост и рейтинг блогера \u2014 никаких скрытых комиссий." },

  // Steps
  "steps.label": { uz: "Qanday ishlaydi", ru: "Как это работает" },
  "steps.title": { uz: "Reklamaga 4 qadam", ru: "4 шага до рекламы" },
  "steps.1": { uz: "Mahsulotni tasvirlab, byudjetni kiriting", ru: "Опишите продукт и укажите бюджет" },
  "steps.2": { uz: "AI mos blogerlarni tanlaydi", ru: "AI подберёт подходящих блогеров" },
  "steps.3": { uz: "Tayyor reklama matnini oling", ru: "Получите готовый рекламный текст" },
  "steps.4": { uz: "Bloger bilan bevosita bog\u2018laning", ru: "Свяжитесь с блогером напрямую" },

  // CTA
  "cta.title": { uz: "Reklama boshlashga tayyormisiz?", ru: "Готовы запустить рекламу?" },
  "cta.description": { uz: "Bepul sinab ko\u2018ring \u2014 AI blogerlarni tanlaydi va hoziroq post yozadi.", ru: "Попробуйте бесплатно \u2014 AI подберёт блогеров и напишет пост прямо сейчас." },
  "cta.button": { uz: "Bepul boshlash", ru: "Начать бесплатно" },

  // Footer
  "footer.copy": { uz: "\u00A9 2026 AdLink \u2014 O\u2018zbekiston uchun AI bloger platformasi.", ru: "\u00A9 2026 AdLink \u2014 AI-платформа блогеров для Узбекистана." },

  // Dashboard
  "dashboard.title": { uz: "Blogerlarni topish", ru: "Найти блогеров" },
  "dashboard.subtitle": { uz: "AI blogerlarni tanlaydi va mahsulotingiz uchun reklama posti yaratadi", ru: "AI подберёт блогеров и сгенерирует рекламный пост под ваш продукт" },
  "dashboard.empty.title": { uz: "Qidiruv natijalari", ru: "Результаты поиска" },
  "dashboard.empty.desc": { uz: "Chapdagi formani to'ldiring va blogerlarni toping", ru: "Заполните форму слева и найдите блогеров" },
  "dashboard.results.title": { uz: "Qidiruv natijalari", ru: "Результаты поиска" },
  "dashboard.results.subtitle": { uz: "AI tomonidan tanlangan {count} ta blogger", ru: "AI подобрал {count} блогеров" },
  "dashboard.new_search": { uz: "Yangi qidiruv", ru: "Новый поиск" },
  "dashboard.found_bloggers": { uz: "Topilgan bloggerlar", ru: "Найденные блогеры" },
  "dashboard.all_bloggers": { uz: "Barcha bloggerlar ro'yxati", ru: "Список всех блогеров" },
  "dashboard.new_search_btn": { uz: "Yangi qidiruv", ru: "Новый поиск" },
  "dashboard.no_bloggers": { uz: "Hech qanday blogger topilmadi", ru: "Блогеры не найдены" },
  "dashboard.change_criteria": { uz: "Kritiklaringizni o'zgartirib qayta urinib ko'ring", ru: "Измените критерии и попробуйте снова" },
  "dashboard.ai_search": { uz: "AI bilan qidirish", ru: "Поиск с AI" },
  "dashboard.view_profile": { uz: "Profilni ko'rish", ru: "Посмотреть профиль" },
  "dashboard.send_order": { uz: "Buyurtma berish", ru: "Отправить заказ" },

  // Search form
  "search.title": { uz: "Blogerlarni topish", ru: "Найти блогеров" },
  "search.subtitle": { uz: "Mahsulotni tasvirlab bering — AI blogerlarni tanlaydi va reklama matni yozadi", ru: "Опишите продукт — AI подберёт блогеров и напишет рекламный текст" },
  "search.budget": { uz: "Byudjet (so'm)", ru: "Бюджет (сум)" },
  "search.budget_min": { uz: "Minimal byudjet (so'm)", ru: "Минимальный бюджет (сум)" },
  "search.budget_max": { uz: "Maksimal byudjet (so'm)", ru: "Максимальный бюджет (сум)" },
  "search.description": { uz: "Mahsulot tavsifi", ru: "Описание продукта" },
  "search.description_placeholder": { uz: "Mahsulot yoki xizmatingizni tasvirlab bering...", ru: "Опишите ваш продукт или услугу..." },
  "search.goal": { uz: "Reklama maqsadi", ru: "Цель рекламы" },
  "search.goal_placeholder": { uz: "Maqsadni tanlang", ru: "Выберите цель" },
  "search.goal_sales": { uz: "Sotuvlarni oshirish", ru: "Увеличить продажи" },
  "search.goal_brand": { uz: "Brend tanilishi", ru: "Узнаваемость бренда" },
  "search.goal_customers": { uz: "Yangi mijozlarni jalb qilish", ru: "Привлечь новых клиентов" },
  "search.platforms": { uz: "Ijtimoiy tarmoqlar", ru: "Социальные сети" },
  "search.button": { uz: "Blogerlarni topish", ru: "Найти блогеров" },
  "search.loading": { uz: "AI qidirmoqda...", ru: "AI ищет..." },

  // Blogger card
  "card.ai_text": { uz: "AI reklama matni", ru: "AI рекламный текст" },
  "card.copy": { uz: "Nusxalash", ru: "Скопировать" },
  "card.copied": { uz: "Nusxalandi", ru: "Скопировано" },
  "card.subscribers": { uz: "obunachi", ru: "подписчиков" },
  "card.contact": { uz: "Bog'lanish", ru: "Связаться" },
  "card.view_profile": { uz: "Profilni ko'rish", ru: "Посмотреть профиль" },

  // Blogger dashboard
  "blogger_dashboard.title": { uz: "Bloger Dashboard", ru: "Панель блогера" },
  "blogger_dashboard.subtitle": { uz: "Profil ma'lumotlaringizni boshqaring", ru: "Управляйте данными вашего профиля" },
  "blogger_dashboard.blogger_fallback": { uz: "Bloger", ru: "Блогер" },
  "blogger_dashboard.nav.dashboard": { uz: "Dashboard", ru: "Главная" },
  "blogger_dashboard.nav.profile": { uz: "Profil", ru: "Профиль" },
  "blogger_dashboard.error.load_profile": { uz: "Profilni yuklashda xatolik yuz berdi", ru: "Не удалось загрузить профиль" },
  "blogger_dashboard.profile_saved_desc": { uz: "Profil ma'lumotlari muvaffaqiyatli saqlandi", ru: "Данные профиля успешно сохранены" },
  "blogger_dashboard.stats.audience": { uz: "Auditoriya", ru: "Аудитория" },
  "blogger_dashboard.stats.price": { uz: "Narx (so'm)", ru: "Цена (сум)" },
  "blogger_dashboard.stats.categories": { uz: "Kategoriyalar", ru: "Категории" },
  "blogger_dashboard.stats.target_audiences": { uz: "Target auditoriyalar", ru: "Целевые аудитории" },
  "blogger_dashboard.profile_card.title": { uz: "Profil ma'lumotlari", ru: "Данные профиля" },
  "blogger_dashboard.profile_card.subtitle": { uz: "Asosiy ma'lumotlaringiz", ru: "Ваши основные данные" },
  "blogger_dashboard.fields.username": { uz: "Username", ru: "Имя пользователя" },
  "blogger_dashboard.fields.username_placeholder": { uz: "@username", ru: "@username" },
  "blogger_dashboard.fields.email": { uz: "Email", ru: "Email" },
  "blogger_dashboard.fields.audience": { uz: "Auditoriya", ru: "Аудитория" },
  "blogger_dashboard.fields.audience_placeholder": { uz: "25000", ru: "25000" },
  "blogger_dashboard.fields.price": { uz: "Narx (so'm)", ru: "Цена (сум)" },
  "blogger_dashboard.fields.price_placeholder": { uz: "200000", ru: "200000" },
  "blogger_dashboard.fields.content_categories": { uz: "Kontent kategoriyalari", ru: "Категории контента" },
  "blogger_dashboard.fields.content_category_placeholder": { uz: "Kontent kategoriyasi", ru: "Категория контента" },
  "blogger_dashboard.fields.target_audiences": { uz: "Target auditoriyalar", ru: "Целевые аудитории" },
  "blogger_dashboard.fields.target_audience_placeholder": { uz: "Target auditoriya", ru: "Целевая аудитория" },
  "blogger_dashboard.fields.socials": { uz: "Ijtimoiy tarmoqlar", ru: "Социальные сети" },
  "blogger_dashboard.fields.socials_placeholder": { uz: "telegram: @channel\ninstagram: @username\ntiktok: @username", ru: "telegram: @channel\ninstagram: @username\ntiktok: @username" },
  "blogger_dashboard.fields.selected_regions": { uz: "Tanlangan shaharlar", ru: "Выбранные регионы" },
  "blogger_dashboard.fields.selected_regions_hint": { uz: "Shaharlarni profil sahifasida o'zgartirishingiz mumkin", ru: "Изменить регионы можно на странице профиля" },
  "blogger_dashboard.fields.no_regions": { uz: "Shaharlar tanlanmagan", ru: "Регионы не выбраны" },
  "blogger_dashboard.actions.add_category": { uz: "Kategoriya qo'shish", ru: "Добавить категорию" },
  "blogger_dashboard.actions.add_target_audience": { uz: "Auditoriya qo'shish", ru: "Добавить аудиторию" },
  "blogger_dashboard.last_updated": { uz: "Oxirgi yangilanish", ru: "Последнее обновление" },
  "blogger_dashboard.orders": { uz: "Buyurtmalar", ru: "Заказы" },

  // Blogger profile
  "profile.title": { uz: "Bloger profili", ru: "Профиль блогера" },
  "profile.subtitle": { uz: "Profilni to'ldiring, shunda bizneslar sizni topa oladi", ru: "Заполните профиль, чтобы бизнесы могли вас найти" },
  "profile.username": { uz: "Foydalanuvchi nomi", ru: "Имя пользователя" },
  "profile.audience": { uz: "Auditoriya hajmi", ru: "Размер аудитории" },
  "profile.price": { uz: "Post narxi (so'm)", ru: "Цена за пост (сум)" },
  "profile.category": { uz: "Kontent kategoriyasi", ru: "Категория контента" },
  "profile.category_placeholder": { uz: "Kategoriyani tanlang", ru: "Выберите категорию" },
  "profile.category_lifestyle": { uz: "Turmush tarzi", ru: "Lifestyle" },
  "profile.category_tech": { uz: "Texnologiyalar", ru: "Технологии" },
  "profile.category_food": { uz: "Ovqat", ru: "Еда" },
  "profile.category_fashion": { uz: "Moda", ru: "Мода" },
  "profile.category_education": { uz: "Ta'lim", ru: "Образование" },
  "profile.category_business": { uz: "Biznes", ru: "Бизнес" },
  "profile.category_entertainment": { uz: "Ko'ngilchar", ru: "Развлечения" },
  "profile.category_sports": { uz: "Sport", ru: "Спорт" },
  "profile.category_beauty": { uz: "Go'zallik", ru: "Красота" },
  "profile.category_travel": { uz: "Sayohat", ru: "Путешествия" },
  "profile.category_other": { uz: "Boshqa", ru: "Другое" },
  "profile.socials": { uz: "Ijtimoiy tarmoqlar", ru: "Социальные сети" },
  "profile.regions": { uz: "Hududlar (Viloyatlar)", ru: "Регионы (Области)" },
  "profile.regions_placeholder": { uz: "Qaysi viloyatlarda ishlashga tayyorsiz?", ru: "В каких областях готовы работать?" },
  "profile.save": { uz: "Profilni saqlash", ru: "Сохранить профиль" },
  "profile.saved": { uz: "Saqlandi!", ru: "Сохранено!" },
  "profile.pro_title": { uz: "Pro obuna", ru: "Pro подписка" },
  "profile.pro_desc": { uz: "Pro obuna bilan siz topda bo'lasiz va ko'proq buyurtmalar olasiz", ru: "С Pro подпиской вы будете в топе и получите больше заказов" },

  // Blogger profile (dashboard/profile pages)
  "blogger_profile.title": { uz: "Profil", ru: "Профиль" },
  "blogger_profile.subtitle": { uz: "Ma'lumotlaringizni to'ldiring va tahrirlang", ru: "Заполните и отредактируйте ваши данные" },
  "blogger_profile.blogger_fallback": { uz: "Bloger", ru: "Блогер" },
  "blogger_profile.error.load_profile": { uz: "Profilni yuklashda xatolik yuz berdi", ru: "Не удалось загрузить профиль" },
  "blogger_profile.only_bloggers": { uz: "Bu sahifa faqat bloggerlar uchun", ru: "Эта страница только для блогеров" },
  "blogger_profile.profile_saved_desc": { uz: "Profil ma'lumotlari muvaffaqiyatli saqlandi", ru: "Данные профиля успешно сохранены" },
  "blogger_profile.form.title": { uz: "Bloger", ru: "Блогер" },
  "blogger_profile.form.subtitle": { uz: "Profilni to'ldiring, shunda bizneslar sizni topa oladi", ru: "Заполните профиль, чтобы бизнесы могли вас найти" },
  "blogger_profile.fields.avatar": { uz: "Profil rasmi", ru: "Фото профиля" },
  "blogger_profile.fields.avatar_hint": { uz: "JPG, PNG, GIF. Maksimal 5MB", ru: "JPG, PNG, GIF. Максимум 5MB" },
  "blogger_profile.fields.audience_placeholder": { uz: "25 000", ru: "25 000" },
  "blogger_profile.fields.price_placeholder": { uz: "200 000", ru: "200 000" },
  "blogger_profile.social_added": { uz: "{platform} qo'shildi! Profil saqlanmoqda...", ru: "{platform} добавлен! Профиль сохраняется..." },
  "blogger_profile.social_removed": { uz: "{platform} o'chirildi!", ru: "{platform} удалён!" },
  "blogger_profile.social_input_label": { uz: "{platform} profile URL yoki username", ru: "{platform}: ссылка или username" },
  "blogger_profile.social_input_placeholder": { uz: "@username yoki profile link", ru: "@username или ссылка на профиль" },

  // Blogger profile selects
  "blogger_profile.categories.placeholder": { uz: "Kategoriyani tanlang", ru: "Выберите категорию" },
  "blogger_profile.categories.tech_gadgets": { uz: "Texnologiya va gadjetlar", ru: "Технологии и гаджеты" },
  "blogger_profile.categories.Texnologiya_va_gadjetlar": { uz: "Texnologiya va gadjetlar", ru: "Технологии и гаджеты" },
  "blogger_profile.categories.fashion_beauty": { uz: "Moda va go'zallik", ru: "Мода и красота" },
  "blogger_profile.categories.Moda_va_go'zallik": { uz: "Moda va go'zallik", ru: "Мода и красота" },
  "blogger_profile.categories.food_drinks": { uz: "Oziq-ovqat va ichimliklar", ru: "Еда и напитки" },
  "blogger_profile.categories.Oziq-ovqat_va_ichimliklar": { uz: "Oziq-ovqat va ichimliklar", ru: "Еда и напитки" },
  "blogger_profile.categories.education": { uz: "Ta'lim va rivojlanish", ru: "Образование и развитие" },
  "blogger_profile.categories.Ta'lim_va_rivojlanish": { uz: "Ta'lim va rivojlanish", ru: "Образование и развитие" },
  "blogger_profile.categories.health_sport": { uz: "Sog'liq va sport", ru: "Здоровье и спорт" },
  "blogger_profile.categories.Sog'liq_va_sport": { uz: "Sog'liq va sport", ru: "Здоровье и спорт" },
  "blogger_profile.categories.home_building": { uz: "Uy va qurilish", ru: "Дом и строительство" },
  "blogger_profile.categories.Uy_va_qurilish": { uz: "Uy va qurilish", ru: "Дом и строительство" },
  "blogger_profile.categories.auto_transport": { uz: "Avtomobil va transport", ru: "Авто и транспорт" },
  "blogger_profile.categories.Avtomobil_va_transport": { uz: "Avtomobil va transport", ru: "Авто и транспорт" },
  "blogger_profile.categories.travel": { uz: "Sayohat va turizm", ru: "Путешествия и туризм" },
  "blogger_profile.categories.Sayohat_va_turizm": { uz: "Sayohat va turizm", ru: "Путешествия и туризм" },
  "blogger_profile.categories.market_trade": { uz: "Bozor va savdo", ru: "Рынок и торговля" },
  "blogger_profile.categories.Bozor_va_savdo": { uz: "Bozor va savdo", ru: "Рынок и торговля" },
  "blogger_profile.categories.services_consulting": { uz: "Xizmatlar va konsalting", ru: "Услуги и консалтинг" },
  "blogger_profile.categories.Xizmatlar_va_konsalting": { uz: "Xizmatlar va konsalting", ru: "Услуги и консалтинг" },
  "blogger_profile.categories.kids_toys": { uz: "O'yinchoqlar va bolalar mahsulotlari", ru: "Игрушки и детские товары" },
  "blogger_profile.categories.O'yinchoqlar_va_bolalar_mahsulotlari": { uz: "O'yinchoqlar va bolalar mahsulotlari", ru: "Игрушки и детские товары" },
  "blogger_profile.categories.clothing_accessories": { uz: "Kiyim-kechak va aksessuarlar", ru: "Одежда и аксессуары" },
  "blogger_profile.categories.Kiyim-kechak_va_aksessuarlar": { uz: "Kiyim-kechak va aksessuarlar", ru: "Одежда и аксессуары" },
  "blogger_profile.categories.perfume": { uz: "Go'zallik va parfyumeriya", ru: "Красота и парфюмерия" },
  "blogger_profile.categories.Go'zallik_va_parfyumeriya": { uz: "Go'zallik va parfyumeriya", ru: "Красота и парфюмерия" },
  "blogger_profile.categories.electronics": { uz: "Elektronika va jihozlar", ru: "Электроника и техника" },
  "blogger_profile.categories.Elektronika_va_jihozlar": { uz: "Elektronika va jihozlar", ru: "Электроника и техника" },
  "blogger_profile.audiences.placeholder": { uz: "Auditoriyani tanlang", ru: "Выберите аудиторию" },
  "blogger_profile.audiences.youth_18_25": { uz: "18-25 yoshdagi yoshlar", ru: "Молодёжь 18–25" },
  "blogger_profile.audiences.18-25_yoshdagi_yoshlar": { uz: "18-25 yoshdagi yoshlar", ru: "Молодёжь 18–25" },
  "blogger_profile.audiences.women_25_35": { uz: "25-35 yoshdagi faol ayollar", ru: "Активные женщины 25–35" },
  "blogger_profile.audiences.25-35_yoshdagi_faol_ayollar": { uz: "25-35 yoshdagi faol ayollar", ru: "Активные женщины 25–35" },
  "blogger_profile.audiences.students_young_pros": { uz: "Talabalar va yosh mutaxassislar", ru: "Студенты и молодые специалисты" },
  "blogger_profile.audiences.Talabalar_va_yosh_mutaxassislar": { uz: "Talabalar va yosh mutaxassislar", ru: "Студенты и молодые специалисты" },
  "blogger_profile.audiences.workers_business": { uz: "Ishchi va biznesmenlar", ru: "Рабочие и бизнес" },
  "blogger_profile.audiences.Ishchi_va_biznesmenlar": { uz: "Ishchi va biznesmenlar", ru: "Рабочие и бизнес" },
  "blogger_profile.audiences.family_30_45": { uz: "30-45 yoshdagi oilaviy kishilar", ru: "Семейные 30–45" },
  "blogger_profile.audiences.30-45_yoshdagi_oilaviy_kishilar": { uz: "30-45 yoshdagi oilaviy kishilar", ru: "Семейные 30–45" },
  "blogger_profile.audiences.students_16_22": { uz: "16-22 yoshdagi talabalar", ru: "Студенты 16–22" },
  "blogger_profile.audiences.16-22_yoshdagi_talabalar": { uz: "16-22 yoshdagi talabalar", ru: "Студенты 16–22" },
  "blogger_profile.audiences.men_20_30": { uz: "20-30 yoshdagi faol yigitlar", ru: "Активные мужчины 20–30" },
  "blogger_profile.audiences.20-30_yoshdagi_faol_yigitlar": { uz: "20-30 yoshdagi faol yigitlar", ru: "Активные мужчины 20–30" },
  "blogger_profile.audiences.all_internet": { uz: "Barcha yoshdagi internet foydalanuvchilar", ru: "Интернет-пользователи всех возрастов" },
  "blogger_profile.audiences.Barcha_yoshdagi_internet_foydalanuvchilar": { uz: "Barcha yoshdagi internet foydalanuvchilar", ru: "Интернет-пользователи всех возрастов" },
  "blogger_profile.audiences.career_25_40": { uz: "25-40 yoshdagi karyera quruvchilar", ru: "Строящие карьеру 25–40" },
  "blogger_profile.audiences.25-40_yoshdagi_karyera_quruvchilar": { uz: "25-40 yoshdagi karyera quruvchilar", ru: "Строящие карьеру 25–40" },
  "blogger_profile.audiences.fashion_18_30": { uz: "18-30 yoshdagi fashion ixlosmandlari", ru: "Любители моды 18–30" },
  "blogger_profile.audiences.tech_20_35": { uz: "20-35 yoshdagi texnologiya sevuvchilar", ru: "Любители технологий 20–35" },
  "ai_matching.title": { uz: "AI moslash", ru: "AI подбор" },
  "ai_matching.subtitle": { uz: "Sun'iy intellekt yordamida sizning mahsulotingizga eng mos bloggerlarni toping", ru: "С помощью искусственного интеллекта найдите наиболее подходящих блогеров для вашего продукта" },
  "ai_matching.product_category": { uz: "Mahsulot kategoriyasi", ru: "Категория продукта" },
  "ai_matching.target_audience": { uz: "Target auditoriya", ru: "Целевая аудитория" },
  "ai_matching.budget_min": { uz: "Minimal byudjet (so'm)", ru: "Минимальный бюджет (сум)" },
  "ai_matching.budget_max": { uz: "Maksimal byudjet (so'm)", ru: "Максимальный бюджет (сум)" },
  "ai_matching.description": { uz: "Mahsulot tavsifi", ru: "Описание продукта" },
  "ai_matching.platforms": { uz: "Platformalar", ru: "Платформы" },
  "ai_matching.region": { uz: "Hudud Tanlang", ru: "Выберите регион" },
  "ai_matching.button": { uz: "Bloggerlarni topish", ru: "Найти блогеров" },
  "ai_matching.loading": { uz: "AI ishlamoqda...", ru: "AI работает..." },
  "ai_matching.results.title": { uz: "Qidiruv natijalari", ru: "Результаты поиска" },
  "ai_matching.results.subtitle": { uz: "AI tomonidan tanlangan {count} ta blogger", ru: "AI подобрал {count} блогеров" },
  "ai_matching.new_search": { uz: "Yangi qidiruv", ru: "Новый поиск" },
  "ai_matching.empty.title": { uz: "Qidiruv natijalari", ru: "Результаты поиска" },
  "ai_matching.empty.desc": { uz: "Chapdagi formani to'ldiring va blogerlarni toping", ru: "Заполните форму слева и найдите блогеров" },
  "ai_matching.order_sent": { uz: "Buyurtma yuborildi!", ru: "Заказ отправлен!" },
  "ai_matching.order_sent_desc": { uz: "Xabaringiz {bloggerName} ga yuborildi. Tez orada javob olishingiz mumkin.", ru: "Ваш заказ отправлен блогеру {bloggerName}. Ожидайте быстрого ответа." },
  "ai_matching.order_summary": { uz: "Buyurtma ma'lumotlari:", ru: "Информация о заказе:" },
  "ai_matching.order_details": { uz: "Buyurtma tafsilotlari:", ru: "Детали заказа:" },
  "ai_matching.order_blogger": { uz: "Blogger: {bloggerName}", ru: "Блогер: {bloggerName}" },
  "ai_matching.order_business_name": { uz: "Biznes nomi", ru: "Название бизнеса" },
  "ai_matching.order_business_email": { uz: "Biznes email", ru: "Email бизнеса" },
  "ai_matching.order_categories": { uz: "Kategoriyalar", ru: "Категории" },
  "ai_matching.order_budget": { uz: "Byudjet", ru: "Бюджет" },
  "ai_matching.order_not_entered": { uz: "Kiritilmagan", ru: "Не указано" },
  "ai_matching.business_profile_missing": { uz: "Biznes profili topilmadi. Iltimos, avval biznes profilingizni yarating.", ru: "Профиль бизнеса не найден. Пожалуйста, сначала создайте профиль бизнеса." },
  "ai_matching.create_profile": { uz: "Profilingizni yarating", ru: "Создать профиль" },
  "ai_matching.new_order": { uz: "Yangi buyurtma yuborish", ru: "Новый заказ" },

  // Order form labels
  "ai_matching.form.business_name": { uz: "Biznes nomi", ru: "Название бизнеса" },
  "ai_matching.form.business_name_placeholder": { uz: "Biznesingiz nomi", ru: "Название вашего бизнеса" },
  "ai_matching.form.product_category": { uz: "Mahsulot kategoriyasi", ru: "Категория продукта" },
  "ai_matching.form.product_category_placeholder": { uz: "Masalan: Moda, Texnologiya, Oziq-ovqat", ru: "Например: Мода, Технологии, Еда" },
  "ai_matching.form.budget": { uz: "Byudjet (so'm)", ru: "Бюджет (сум)" },
  "ai_matching.form.budget_placeholder": { uz: "500 000", ru: "500 000" },
  "ai_matching.form.business_email": { uz: "Biznes email", ru: "Email бизнеса" },
  "ai_matching.form.business_email_placeholder": { uz: "biznes@example.com", ru: "бизнес@example.com" },
  "ai_matching.form.message": { uz: "Xabar bloggerga", ru: "Сообщение блогеру" },
  "ai_matching.form.message_placeholder": { uz: "Assalomu alaykum! Sizning profilingiz bilan hamkorlik qilishni hohlayman. Mahsulotim haqida ma'lumot berishni so'rayman...", ru: "Здравствуйте! Хотел бы сотрудничать с вашим профилем. Позвольте рассказать о моем продукте..." },
  "ai_matching.form.description": { uz: "Qo'shimcha ma'lumot", ru: "Дополнительная информация" },
  "ai_matching.form.description_placeholder": { uz: "Mahsulot haqida qo'shimcha ma'lumot (ixtiyoriy)", ru: "Дополнительная информация о продукте (необязательно)" },
  "ai_matching.form.submit": { uz: "Buyurtmani yuborish", ru: "Отправить заказ" },
  "ai_matching.form.submitting": { uz: "Yuborilmoqda...", ru: "Отправляется..." },
  "ai_matching.form.footer_note": { uz: "📱 Bloggerga xabar yuboriladi va Telegram orqali bildirishnoma yuboriladi", ru: "📱 Сообщение отправляется блогеру и уведомление отправляется через Telegram" },

  "ai_matching.fill_fields": { uz: "Iltimos, maydonlarni to'liqroq to'ldiring.", ru: "Пожалуйста, заполните поля более полностью." },

  // Profile page
  "profile.not_found": { uz: "Profil topilmadi", ru: "Профиль не найден" },
  "profile.not_found_desc": { uz: "Blogger profili mavjud emas", ru: "Профиль блогера не существует" },
  "profile.back": { uz: "Orqaga qaytish", ru: "Назад" },
  "profile.loading": { uz: "Yuklanmoqda...", ru: "Загрузка..." },
  "profile.error": { uz: "Xatolik yuz berdi", ru: "Произошла ошибка" },
  "profile.audience_count": { uz: "Obunachilar soni", ru: "Количество подписчиков" },
  "profile.price_label": { uz: "Narx", ru: "Цена" },
  "profile.category_label": { uz: "Kategoriya", ru: "Категория" },
  "profile.updated_label": { uz: "Yangilangan", ru: "Обновлено" },
  "profile.no_categories": { uz: "Noma'lum", ru: "Неизвестно" },
  "profile.social_media": { uz: "Ijtimoiy tarmoqlar", ru: "Социальные сети" },
  "profile.no_social_media": { uz: "Ijtimoiy tarmoqlar kiritilmagan", ru: "Социальные сети не указаны" },
  "profile.statistics": { uz: "Statistika", ru: "Статистика" },
  "profile.order_form": { uz: "Buyurtma yuborish", ru: "Отправить заказ" },

  // Chat widget
  "chat.welcome_message": { 
    uz: "👋 Assalomu alaykum! Men AdLink AI yordamchiman. Quyidagi savollardan birini tanlang:\n\n🔹 Platforma qanday ishlaydi?\n🔹 Blogger qanday topiladi?\n🔹 Biznes qanday topiladi?\n🔹 Narxlar qancha?\n🔹 Reklama postlari qanday yaratiladi?\n🔹 Qaysi viloyatlarda ishlaysiz?\n🔹 Qanday platformalar bor?\n🔹 Ro'yxatdan qanday o'tiladi?\n\nYoki o'zingiz savol bering, men qanday yordam bera olaman? 🤖", 
    ru: "👋 Здравствуйте! Я AdLink AI помощник. Выберите один из следующих вопросов:\n\n🔹 Как работает платформа?\n🔹 Как найти блогера?\n🔹 Как найти бизнес?\n🔹 Какие цены?\n🔹 Как создаются рекламные посты?\n🔹 В каких областях работаете?\n🔹 Какие платформы есть?\n🔹 Как зарегистрироваться?\n\nИли задайте свой вопрос, чем я могу помочь? 🤖" 
  },

  // Learn page
  "learn.title": { uz: "AdLink Learning AI", ru: "AdLink Learning AI" },
  "learn.subtitle": { uz: "AI o'rgatuvchi yordamchi", ru: "AI помощник для обучения" },
  "learn.mode_badge": { uz: "O'rganish rejimi", ru: "Режим обучения" },
  "learn.center_title": { uz: "O'rganish Markazi", ru: "Центр обучения" },
  "learn.center_desc": {
    uz: "AI bilan blogger marketing, business growth va platforma strategiyalari bo'yicha chuqur bilim oling.",
    ru: "Получайте глубокие знания по маркетингу с блогерами, росту бизнеса и стратегиям платформы с помощью AI.",
  },
  "learn.stats.bloggers": { uz: "Bloggerlar", ru: "Блогеры" },
  "learn.stats.audience": { uz: "Auditoriya", ru: "Аудитория" },
  "learn.stats.support": { uz: "AI yordam", ru: "AI поддержка" },
  "learn.start": { uz: "Boshlash", ru: "Начать" },
  "learn.quick_questions": { uz: "Tezkor Savollar", ru: "Быстрые вопросы" },
  "learn.chat.title": { uz: "Learning Assistant", ru: "Learning Assistant" },
  "learn.chat.subtitle": { uz: "Doim yordam beraman", ru: "Всегда готов помочь" },
  "learn.input_placeholder": { uz: "Savolingizni yuboring...", ru: "Отправьте ваш вопрос..." },
  "learn.ai_unavailable": { uz: "AI hozircha mavjud emas. Iltimos, keyinroq urinib ko'ring.", ru: "AI сейчас недоступен. Пожалуйста, попробуйте позже." },
  "learn.check_internet": { uz: "Internet aloqasini tekshiring. AI hozircha mavjud emas.", ru: "Проверьте интернет-соединение. AI сейчас недоступен." },
  "learn.welcome_message": {
    uz:
      "👋 Assalomu alaykum! Men AdLink Learning AI yordamchisiz.\n\n📚 **Nimalarda yordam bera olaman:**\n\n🎯 **Blogger Marketing:**\n• Blogger tanlash strategiyalari\n• Reklama kampaniyalari\n• Content marketing\n• Sotuv konversiyalari\n\n💰 **Business Growth:**\n• Byudjet optimizatsiyasi\n• ROI hisoblari\n• Scalability strategiyalari\n• Market tahlili\n\n🔧 **Platforma Funksiyalari:**\n• AI matching algoritmi\n• Blogger profillari\n• Order management\n• Analytics\n\n📊 **Industry Insights:**\n• O'zbekiston blogger marketi\n• Trendlar va statistikalar\n• Raqiblar tahlili\n• Future predictions\n\n🤖 Men AI yordamchi sifatida sizga chuqur va professional maslahatlar beraman.\n\nQanday savolingiz bor? O'rganishni boshlaymiz!",
    ru:
      "👋 Здравствуйте! Я AdLink Learning AI помощник.\n\n📚 **Чем я могу помочь:**\n\n🎯 **Маркетинг с блогерами:**\n• Стратегии выбора блогеров\n• Рекламные кампании\n• Контент-маркетинг\n• Конверсия продаж\n\n💰 **Рост бизнеса:**\n• Оптимизация бюджета\n• Расчеты ROI\n• Стратегии масштабирования\n• Анализ рынка\n\n🔧 **Функции платформы:**\n• Алгоритм AI matching\n• Профили блогеров\n• Управление заказами\n• Аналитика\n\n📊 **Инсайты индустрии:**\n• Рынок блогеров Узбекистана\n• Тренды и статистика\n• Анализ конкурентов\n• Прогнозы\n\n🤖 Как AI помощник я дам вам глубокие и профессиональные рекомендации.\n\nКакой у вас вопрос? Давайте начнем обучение!",
  },
  "learn.topic.blogger_marketing.title": { uz: "🎯 Blogger Marketing", ru: "🎯 Маркетинг с блогерами" },
  "learn.topic.blogger_marketing.desc": { uz: "Blogger tanlash, kampaniyalar, ROI optimizatsiyasi", ru: "Выбор блогеров, кампании, оптимизация ROI" },
  "learn.topic.blogger_marketing.prompt": { uz: "Blogger marketing asoslari va strategiyalari haqida batafsil aytib bering", ru: "Расскажите подробно про основы и стратегии маркетинга с блогерами" },
  "learn.topic.market_analytics.title": { uz: "📊 Market Analytics", ru: "📊 Аналитика рынка" },
  "learn.topic.market_analytics.desc": { uz: "Statistika, trendlar, narxlar, bozor tahlili", ru: "Статистика, тренды, цены, анализ рынка" },
  "learn.topic.market_analytics.prompt": { uz: "O'zbekiston blogger marketi haqida statistika va trendlar", ru: "Статистика и тренды по рынку блогеров Узбекистана" },
  "learn.topic.content_marketing.title": { uz: "✍️ Content Marketing", ru: "✍️ Контент-маркетинг" },
  "learn.topic.content_marketing.desc": { uz: "Reklama postlari, content strategiya, engagement", ru: "Рекламные посты, контент-стратегия, вовлеченность" },
  "learn.topic.content_marketing.prompt": { uz: "Content marketing va reklama postlari yaratish bo'yicha maslahatlar", ru: "Советы по контент-маркетингу и созданию рекламных постов" },
  "learn.topic.budget_optimization.title": { uz: "💰 Budget Optimization", ru: "💰 Оптимизация бюджета" },
  "learn.topic.budget_optimization.desc": { uz: "Byudjet, ROI, pul ishlash strategiyalari", ru: "Бюджет, ROI, стратегии заработка" },
  "learn.topic.budget_optimization.prompt": { uz: "Byudjetni optimallashtirish va pul ishlash strategiyalari", ru: "Стратегии оптимизации бюджета и увеличения прибыли" },
  "chat.image_response": { 
    uz: "Rasmni qabul qildim! Bu profil rasmi ko'rinadi. Endi sizga qanday yordam bera olaman? Quyidagi savollardan birini tanlang:\n\n🔹 Platforma qanday ishlaydi?\n🔹 Blogger qanday topiladi?\n🔹 Biznes qanday topiladi?\n🔹 Narxlar qancha?\n🔹 Reklama postlari qanday yaratiladi?\n🔹 Qaysi viloyatlarda ishlaysiz?\n🔹 Qanday platformalar bor?\n🔹 Ro'yxatdan qanday o'tiladi?\n\nYoki o'zingiz savol bering! 🤖", 
    ru: "Изображение получено! Это выглядит как профильное изображение. Теперь чем я могу вам помочь? Выберите один из следующих вопросов:\n\n🔹 Как работает платформа?\n🔹 Как найти блогера?\n🔹 Как найти бизнес?\n🔹 Какие цены?\n🔹 Как создаются рекламные посты?\n🔹 В каких областях работаете?\n🔹 Какие платформы есть?\n🔹 Как зарегистрироваться?\n\nИли задайте свой вопрос! 🤖" 
  },
  "chat.greeting_response": { 
    uz: "Assalomu alaykum! AdLink AI yordamchiman. Quyidagi savollardan birini tanlang:\n\n🔹 Platforma qanday ishlaydi?\n🔹 Blogger qanday topiladi?\n🔹 Biznes qanday topiladi?\n🔹 Narxlar qancha?\n🔹 Reklama postlari qanday yaratiladi?\n🔹 Qaysi viloyatlarda ishlaysiz?\n🔹 Qanday platformalar bor?\n🔹 Ro'yxatdan qanday o'tiladi?\n\nYoki o'zingiz savol bering! 🤖", 
    ru: "Здравствуйте! Я AdLink AI помощник. Выберите один из следующих вопросов:\n\n🔹 Как работает платформа?\n🔹 Как найти блогера?\n🔹 Как найти бизнес?\n🔹 Какие цены?\n🔹 Как создаются рекламные посты?\n🔹 В каких областях работаете?\n🔹 Какие платформы есть?\n🔹 Как зарегистрироваться?\n\nИли задайте свой вопрос! 🤖" 
  },
  "chat.default_response": { 
    uz: "Kechirasiz, tushunmadim. Quyidagi savollardan birini tanlang:\n\n🔹 Platforma qanday ishlaydi?\n🔹 Blogger qanday topiladi?\n🔹 Biznes qanday topiladi?\n🔹 Narxlar qancha?\n🔹 Reklama postlari qanday yaratiladi?\n🔹 Qaysi viloyatlarda ishlaysiz?\n🔹 Qanday platformalar bor?\n🔹 Ro'yxatdan qanday o'tiladi?\n\nYoki o'zingiz savol bering, men qanday yordam bera olaman? 🤖", 
    ru: "Извините, не понял. Выберите один из следующих вопросов:\n\n🔹 Как работает платформа?\n🔹 Как найти блогера?\n🔹 Как найти бизнес?\n🔹 Какие цены?\n🔹 Как создаются рекламные посты?\n🔹 В каких областях работаете?\n🔹 Какие платформы есть?\n🔹 Как зарегистрироваться?\n\nИли задайте свой вопрос, чем я могу помочь? 🤖" 
  },
  "chat.ai_name": { uz: "AdLink AI", ru: "AdLink AI" },
  "chat.ai_status": { uz: "Online • Yordamchi", ru: "Онлайн • Помощник" },
  "chat.input_placeholder": { uz: "Savol bering yoki rasm yuboring...", ru: "Задайте вопрос или отправьте изображение..." },
  "chat.footer_text": { uz: "🤖 AdLink AI - 24/7 yordam • Rasm yuborishingiz mumkin", ru: "🤖 AdLink AI - 24/7 помощь • Можно отправлять изображения" },

  // Orders
  "orders.back_to_dashboard": { uz: "Asosiy sahifa", ru: "Главная страница" },
  "orders.my_orders": { uz: "Buyurtmalarim", ru: "Мои заказы" },
  "orders.auto_refresh": { uz: "Avto-refresh", ru: "Авто-обновление" },
  "orders.title": { uz: "Buyurtmalar", ru: "Заказы" },
  "orders.pending": { uz: "kutilayotgan", ru: "ожидается" },
  "orders.accepted": { uz: "qabul qilingan", ru: "принят" },
  "orders.rejected": { uz: "rad etilgan", ru: "отклонён" },
  "orders.no_orders": { uz: "Buyurtmalar yo'q", ru: "Заказов нет" },
  "orders.no_orders_desc": { uz: "Siz hali hech qanday buyurtma yubormagansiz", ru: "Вы еще не отправляли ни одного заказа" },
  "orders.waiting_response": { uz: "Kutilmoqda - blogger javobini kutayapti", ru: "Ожидается - ожидается ответ блогера" },
  "orders.order_accepted": { uz: "Blogger buyurtmani qabul qildi", ru: "Блогер принял заказ" },
  "orders.accepted_at": { uz: "Qabul qilingan vaqt", ru: "Время принятия" },
  "orders.recently_accepted": { uz: "Yaqinda qabul qilindi", ru: "Недавно принят" },
  "orders.order_rejected": { uz: "Blogger buyurtmani rad etdi", ru: "Блогер отклонил заказ" },
  "orders.rejected_at": { uz: "Rad etilgan vaqt", ru: "Время отклонения" },
  "orders.recently_rejected": { uz: "Yaqinda rad etildi", ru: "Недавно отклонён" },
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  tr: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("uz")

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && (savedLocale === "uz" || savedLocale === "ru")) {
      setLocale(savedLocale)
    }
  }, [])

  const tr = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const entry = t[key]
      if (!entry) return key
      let text = entry[locale]
      
      // Replace placeholders like {bloggerName} with actual values
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value))
        })
      }
      
      return text
    },
    [locale]
  )

  const value = useMemo(() => ({ 
    locale, 
    setLocale: (newLocale: Locale) => {
      setLocale(newLocale)
      localStorage.setItem("locale", newLocale)
    }, 
    tr 
  }), [locale, tr])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}
