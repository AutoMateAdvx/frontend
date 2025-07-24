"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GlobeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [mounted, setMounted] = useState(false); // 标记组件是否已挂载

    // 仅在客户端初始化语言
    useEffect(() => {
        setMounted(true);
        const supportedLangs = ["en", "zh", "ja"];
        const storedLang = localStorage.getItem("preferredLanguage");
        const browserLang = navigator.language;
        const defaultLang = supportedLangs.find(l => browserLang.includes(l)) || "en";
        
        i18n.changeLanguage(storedLang || defaultLang);
    }, [i18n]);

    const languages = [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "zh", name: "中文", flag: "🇨🇳" },
        { code: "ja", name: "日本語", flag: "🇯🇵" },
    ];

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("preferredLanguage", lang); // 持久化存储
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="rounded-full" disabled>
                <GlobeIcon className="h-5 w-5" />
            </Button>
        ); // SSR 期间返回占位符
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <GlobeIcon className="h-5 w-5" />
                    <span className="sr-only">切换语言</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={i18n.language === language.code ? "bg-accent" : ""}
                    >
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}