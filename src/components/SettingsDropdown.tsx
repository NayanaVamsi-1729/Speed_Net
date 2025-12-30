import { Sun, Moon, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage, languages } from '@/contexts/LanguageContext';

export const SettingsDropdown = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="flex items-center gap-2">
      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-9 w-9 rounded-lg border border-border/50 bg-card/50 hover:bg-accent"
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 text-foreground" />
        ) : (
          <Moon className="h-4 w-4 text-foreground" />
        )}
      </Button>

      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 rounded-lg border border-border/50 bg-card/50 hover:bg-accent px-3"
          >
            <Globe className="h-4 w-4 text-foreground" />
            <span className="text-sm">{currentLang?.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-card border-border">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Language
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`cursor-pointer ${language === lang.code ? 'bg-accent' : ''}`}
            >
              <span className="mr-2">{lang.flag}</span>
              <span>{lang.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
