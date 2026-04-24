import { useEffect, useRef, useState } from "react";
import AutoPlay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface SlideData {
  id: number | string;
  image: string;
  title?: string;
}

interface SlideShowProps {
  slides: SlideData[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

const SlideShow: React.FC<SlideShowProps> = ({
  slides,
  autoPlay = true,
  autoPlayDelay = 3200,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const plugin = useRef(
    autoPlay
      ? AutoPlay({ delay: autoPlayDelay, stopOnMouseEnter: true })
      : null,
  );

  return (
    <div className="relative w-full">
      <Carousel
        className="w-full"
        setApi={setApi}
        plugins={plugin.current ? [plugin.current] : []}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {slides.map(({ id, image, title }, index) => (
            <CarouselItem key={id}>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-[0_18px_30px_rgba(15,56,76,0.2)]">
                <img
                  src={image}
                  alt={title || `slide ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                {title && (
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="text-lg font-semibold leading-snug">{title}</h3>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`切换到第 ${index + 1} 张`}
            className={`h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "w-7 bg-white"
                : "w-2 bg-white/55 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideShow;
