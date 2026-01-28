import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimationSection = () => {
  const sectionRef = useRef(null);
  const rightRef = useRef(null);
  const imgRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const right = rightRef.current;
    const images = imgRefs.current;

    // Main timeline for scrolling the right container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=300%",
        scrub: true,
        pin: true,
      },
    });

    tl.to(right, {
      yPercent: -75,
      ease: "none",
    });

    // Individual image scale animations
    images.forEach((img) => {
      if (img) {
        gsap.fromTo(
          img,
          { scale: 0.65 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
              end: "bottom 10%",
              scrub: true,
              onUpdate: (self) => {
                const s = 0.65 + Math.sin(self.progress * Math.PI) * 0.35;
                gsap.set(img, { scale: s });
              },
            },
          }
        );
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToImgRefs = (el) => {
    if (el && !imgRefs.current.includes(el)) {
      imgRefs.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="w-full h-screen flex overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(assest-images/03 1.png)"
      }}
    >
      <div
        ref={rightRef}
        className="w-[65%] h-[350vh] flex flex-col items-center justify-start gap-[5vh] pt-[65vh] box-border overflow-hidden"
      >
        <div className="w-[85%] h-[67.5vh] relative overflow-hidden rounded-2xl">
          <img
            ref={addToImgRefs}
            src="https://i.pinimg.com/originals/b5/03/bf/b503bf56eb822bd27ced62354be24f1d.jpg"
            alt=""
            className="w-full h-full object-cover block rounded-2xl"
            style={{ transformOrigin: 'center', willChange: 'transform' }}
          />
        </div>
        <div className="w-[85%] h-[67.5vh] relative overflow-hidden rounded-2xl">
          <img
            ref={addToImgRefs}
            src="https://inspgr.id/app/uploads/2020/06/illustration-dave-arcade-01.jpg"
            alt=""
            className="w-full h-full object-cover block rounded-2xl"
            style={{ transformOrigin: 'center', willChange: 'transform' }}
          />
        </div>
        <div className="w-[85%] h-[67.5vh] relative overflow-hidden rounded-2xl">
          <img
            ref={addToImgRefs}
            src="https://wallpapers.com/images/featured/cool-art-omrsd0ip619jtven.jpg"
            alt=""
            className="w-full h-full object-cover block rounded-2xl"
            style={{ transformOrigin: 'center', willChange: 'transform' }}
          />
        </div>
        <div className="w-[85%] h-[67.5vh] relative overflow-hidden rounded-2xl">
          <img
            ref={addToImgRefs}
            src="https://plus.unsplash.com/premium_photo-1671019820530-728527dec7e4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29vbCUyMGFydHxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000"
            alt=""
            className="w-full h-full object-cover block rounded-2xl"
            style={{ transformOrigin: 'center', willChange: 'transform' }}
          />
        </div>
      </div>
      <div className="w-[35%] h-full flex justify-center items-center text-cyan-100 p-8">
        <div className="left-para">
          <h1 className="text-5xl">About us</h1>
          <p className="text-base leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt voluptas eveniet iure at nihil
            reiciendis voluptatibus voluptates recusandae? Incidunt doloribus sapiente officia asperiores facere
            quia quidem molestias exercitationem beatae dolorum.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AnimationSection;
