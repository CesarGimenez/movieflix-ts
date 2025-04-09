
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { Genre } from "@/store/movieStore";
import { genderMovieName } from '../lib/utils';

interface FilterPanelProps {
  filters: {
    searchQuery: string;
    selectedGenres: number[];
    yearRange: [number, number];
  };
  genres?: Genre[];
  toggleGenre: (genreId: number) => void;
  clearFilters: () => void;
  setYearRange: (range: [number, number]) => void;
  hasActiveFilters: boolean;
}

const FilterPanel = ({ 
  filters, 
  genres, 
  toggleGenre, 
  clearFilters, 
  setYearRange,
  hasActiveFilters 
}: FilterPanelProps) => {
  const isMobile = useIsMobile();
  const [localYearRange, setLocalYearRange] = useState<[number, number]>(filters.yearRange);

  // Apply year filter
  const applyYearFilter = () => {
    setYearRange(localYearRange);
  };

  // Reset year filter
  const resetYearFilter = () => {
    const defaultYearRange: [number, number] = [1900, new Date().getFullYear()];
    setLocalYearRange(defaultYearRange);
    setYearRange(defaultYearRange);
  };

  return (
    <div className="flex items-center">
      {hasActiveFilters && (
        <Button
          variant="default"
          className="mr-2 text-sm flex items-center text-movie-accent"
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      )}

      <Sheet>
        <SheetTrigger asChild>
          {!isMobile && (
            <Button
              variant="default"
              className="text-sm flex items-center text-movie-accent"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtrar
            </Button>
          )}
        </SheetTrigger>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="bg-movie-card text-movie-text overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="text-movie-text">
              Filtrar Peliculas
            </SheetTitle>
          </SheetHeader>

          {/* Year Range Filter */}
          <div className="mt-6">
            <h3 className="font-medium mb-3">Estreno</h3>
            <div className="mb-2 flex justify-between">
              <span>{localYearRange[0]}</span>
              <span>{localYearRange[1]}</span>
            </div>
            <Slider
              defaultValue={localYearRange}
              min={1900}
              max={new Date().getFullYear()}
              step={1}
              value={localYearRange}
              onValueChange={(value) =>
                setLocalYearRange(value as [number, number])
              }
              className="mb-4"
            />
            <div className="flex gap-2 mb-6">
              <Button
                onClick={applyYearFilter}
                className="bg-movie-accent text-white hover:bg-movie-accent/80"
              >
                Aplicar
              </Button>
              <Button
                variant="default"
                className="text-movie-accent hover:bg-movie-accent/20"
                onClick={resetYearFilter}
              >
                Limpiar
              </Button>
            </div>
          </div>

          {/* Genre Filter */}
          <div className="mt-4">
            <h3 className="font-medium mb-3">Generos</h3>
            <div className="flex flex-wrap gap-2">
              {genres?.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filters.selectedGenres.includes(genre.id)
                      ? "bg-movie-accent text-white"
                      : "bg-movie-background text-movie-text hover:bg-movie-accent/20"
                  } transition-colors`}
                >
                  {genderMovieName(genre.name as string)}
                </button>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FilterPanel;
