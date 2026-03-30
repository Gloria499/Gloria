import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { 
  Mic2, 
  Music, 
  Settings2, 
  Volume2, 
  ChevronRight, 
  ExternalLink,
  Menu,
  X,
  Activity,
  Zap,
  Layers,
  Cpu
} from 'lucide-react';

// --- Data ---
const SERVICES = [
  { id: 'reinforcement', name: '扩声', en: 'Sound Reinforcement', icon: Volume2, desc: '大型场馆声场覆盖与系统搭建' },
  { id: 'tuning', name: '调音', en: 'Tuning', icon: Settings2, desc: '现场演出实时混音与动态控制' },
  { id: 'recording', name: '录音', en: 'Recording', icon: Mic2, desc: '高保真多轨现场录音与后期处理' },
  { id: 'production', name: '制作', en: 'Production', icon: Music, desc: '编曲、混音及母带处理全流程' },
];

const PROJECTS = [
  { 
    title: 'TF家族「登陆计划」', 
    category: 'CONCERT', 
    image: 'https://picsum.photos/seed/concert1/1200/800',
    tags: ['EASE模拟', '现场调音'],
    id: '01'
  },
  { 
    title: '时代少年团「楼间楼」', 
    category: 'STADIUM', 
    image: 'https://picsum.photos/seed/concert2/1200/800',
    tags: ['大型扩声', '系统搭建'],
    id: '02'
  },
  { 
    title: 'TOP登陆少年组合', 
    category: 'LIVE SHOW', 
    image: 'https://picsum.photos/seed/concert3/1200/800',
    tags: ['全案音频', '多轨录音'],
    id: '03'
  },
  { 
    title: '北京卫视《跨界歌王》', 
    category: 'TV SHOW', 
    image: 'https://picsum.photos/seed/show1/1200/800',
    tags: ['电视混音', '现场扩声'],
    id: '04'
  },
  { 
    title: '济南《黄河入海》', 
    category: 'ORCHESTRA', 
    image: 'https://picsum.photos/seed/show2/1200/800',
    tags: ['交响乐扩声', '声场校准'],
    id: '05'
  },
];

const TEAM = [
  { name: '李涛', role: '创始人 / 首席调音师', desc: '资深音响工程师，曾主导多场万人级演唱会。' },
  { name: '黄家明', role: '系统工程师', desc: '精通声场模拟与系统校准，确保每一个角落的听感一致。' },
  { name: '巩安琪', role: '录音工程师', desc: '细腻的听觉捕捉，负责现场多轨录音与后期缩混。' },
  { name: '太阳RJ', role: '音乐制作人', desc: '跨界电子音乐制作，为舞台注入先锋听感。' },
];

// --- Components ---

const Logo = ({ className = "w-32", animate = false }) => {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={animate ? { opacity: 0, scale: 0.9 } : {}}
      animate={animate ? { 
        opacity: [0, 1, 0.8, 1], 
        scale: 1,
      } : {}}
      transition={{ 
        duration: 2, 
        ease: "easeOut",
      }}
    >
      <img 
        src="https://storage.googleapis.com/applet-assets/ais-dev-wcd55lcnog3cszyw7rj5sv-658178165151.asia-east1.run.app/logo_original.png" 
        alt="DOTOP STUDIO" 
        className="w-full h-auto block brightness-125 contrast-125"
        onError={(e) => {
          // Fallback to a placeholder if the specific URL fails
          e.currentTarget.src = "https://picsum.photos/seed/dotop-logo/400/180?blur=10";
        }}
        referrerPolicy="no-referrer"
      />
      {animate && (
        <>
          <motion.div 
            className="absolute inset-0 bg-white/5 blur-xl rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />
        </>
      )}
    </motion.div>
  );
};

const MasterFader = ({ progress }: { progress: any }) => {
  const faderY = useTransform(progress, [0, 1], [0, 300]);
  const springY = useSpring(faderY, { stiffness: 100, damping: 30 });

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-[60] hidden lg:flex flex-col items-center gap-4">
      <span className="text-[9px] font-mono text-brand-orange vertical-text uppercase tracking-[0.3em] opacity-50">Master Output</span>
      <div className="w-1 h-[300px] bg-white/5 rounded-full relative">
        <motion.div 
          className="w-8 h-12 glass-panel absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ top: springY }}
        >
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-orange shadow-[0_0_10px_rgba(242,125,38,0.8)]" />
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-[10px] font-mono text-brand-orange">
            {useTransform(progress, (p: number) => `${Math.round(p * 100)}%`).get()}
          </div>
        </motion.div>
      </div>
      <div className="flex flex-col gap-1 mt-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`w-1 h-1 rounded-full ${i < 3 ? 'bg-brand-green' : 'bg-brand-orange'} opacity-30`} />
        ))}
      </div>
    </div>
  );
};

const SectionTitle = ({ title, subtitle, number }: { title: string, subtitle: string, number: string }) => {
  return (
    <div className="mb-24 relative">
      <motion.span 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="text-brand-orange font-mono text-xs tracking-[0.5em] uppercase mb-4 block"
      >
        {subtitle}
      </motion.span>
      <div className="flex items-baseline gap-4">
        <span className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none">{title}</span>
        <span className="text-2xl font-mono text-white/10">{number}</span>
      </div>
      <div className="absolute -left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll-driven transforms
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.2]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.15], [0, 20]);

  // Horizontal scroll for projects
  const targetRef = useRef(null);
  const { scrollYProgress: horizontalProgress } = useScroll({
    target: targetRef,
  });
  const x = useTransform(horizontalProgress, [0, 1], ["0%", "-75%"]);

  return (
    <div ref={containerRef} className="bg-black text-white selection:bg-brand-orange selection:text-black">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-12"
          >
            <Logo className="w-64 md:w-96 mb-12" animate={true} />
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-brand-orange"
              />
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.5em] text-gray-500 animate-pulse">Initializing Sound System...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scanline" />
      <MasterFader progress={scrollYProgress} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-10 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-6">
          <Logo className="w-24 md:w-32" />
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden lg:flex gap-12 text-[10px] font-mono uppercase tracking-[0.3em]">
            {['About', 'Projects', 'Team', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-brand-orange transition-colors relative group">
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-brand-orange transition-all group-hover:w-full" />
              </a>
            ))}
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[120vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, filter: `blur(${heroBlur}px)` }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black z-10" />
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop" 
              alt="Live Concert Atmosphere" 
              className="w-full h-full object-cover grayscale brightness-75"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {/* Dynamic Light Beams */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <motion.div 
              animate={{ rotate: [0, 10, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] bg-gradient-to-tr from-brand-orange/20 via-transparent to-transparent origin-bottom-right"
            />
          </div>
        </motion.div>

        <div className="relative z-20 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo className="w-[70vw] md:w-[45vw] mx-auto mb-16 drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]" animate={true} />
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-px bg-white/20" />
                <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-gray-400">渡头文化调音团队</span>
              </div>
              <p className="max-w-sm text-sm font-light text-gray-400 leading-relaxed text-left">
                我们不只是在调音，我们是在构建一个能够呼吸、能够震慑灵魂的声场。定义顶级演艺的听觉标准。
              </p>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-24 left-12 flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-white/20">0{i+1}</span>
              <div className="w-8 h-px bg-white/10" />
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="about" className="py-48 px-8 max-w-7xl mx-auto">
        <SectionTitle title="Expertise" subtitle="Our Capabilities" number="01" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {SERVICES.map((service, i) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-black p-12 group hover:bg-brand-orange transition-colors duration-500"
            >
              <div className="mb-12 text-brand-orange group-hover:text-black transition-colors">
                <service.icon size={40} strokeWidth={1} />
              </div>
              <h4 className="text-2xl font-bold mb-2 group-hover:text-black transition-colors">{service.name}</h4>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-6 group-hover:text-black/60 transition-colors">{service.en}</p>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-black/80 transition-colors">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Horizontal Projects Section */}
      <section ref={targetRef} className="relative h-[400vh] bg-[#050505]">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="absolute top-24 left-24 z-10">
            <SectionTitle title="Cases" subtitle="Selected Works" number="02" />
          </div>
          
          <motion.div style={{ x }} className="flex gap-12 px-24">
            {PROJECTS.map((project, i) => (
              <div key={i} className="relative flex-shrink-0 w-[85vw] md:w-[60vw] aspect-[16/10] group">
                <div className="absolute -top-12 left-0 flex items-baseline gap-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <span className="text-4xl font-black font-mono">{project.id}</span>
                  <span className="text-xs font-mono uppercase tracking-widest">{project.category}</span>
                </div>
                <div className="w-full h-full overflow-hidden rounded-sm relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                    <div>
                      <h4 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">{project.title}</h4>
                      <div className="flex gap-3">
                        {project.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 border border-white/20 text-[10px] font-mono uppercase rounded-full backdrop-blur-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-black transition-all">
                      <ExternalLink size={24} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* End spacer */}
            <div className="w-[20vw] flex-shrink-0" />
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-48 px-8 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32">
            <SectionTitle title="Crew" subtitle="The Architects" number="03" />
            <p className="max-w-md text-sm font-medium leading-relaxed mb-6">
              我们是一群对波形有着近乎病态执着的极客。每一个分贝的增减，每一毫秒的延迟，都是我们构建极致体验的砖石。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-white p-16 flex flex-col md:flex-row gap-12 items-start hover:bg-gray-50 transition-colors">
                <div className="w-32 h-32 bg-black rounded-full overflow-hidden flex-shrink-0 grayscale">
                  <img src={`https://i.pravatar.cc/200?u=${member.name}`} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-4xl font-black uppercase tracking-tighter mb-2">{member.name}</h4>
                  <p className="text-xs font-mono text-brand-orange uppercase tracking-[0.3em] mb-6">{member.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-48 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-30" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div>
            <h3 className="text-8xl md:text-[10vw] font-black leading-[0.8] tracking-tighter uppercase mb-12">
              LET'S <br />
              <span className="text-brand-orange">MIX.</span>
            </h3>
            <div className="flex flex-col gap-8">
              <div className="group cursor-pointer">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">Email Inquiry</span>
                <p className="text-3xl font-bold group-hover:text-brand-orange transition-colors">datouwenhua@126.com</p>
              </div>
              <div className="group cursor-pointer">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">WeChat Official</span>
                <p className="text-3xl font-bold group-hover:text-brand-orange transition-colors">dotop</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div className="glass-panel p-12 rounded-sm border-l-4 border-l-brand-orange">
              <p className="text-xl font-light leading-relaxed italic mb-8">
                "声音是看不见的建筑。我们的任务是确保这座建筑在每一个人的耳中都是完美的。"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-orange" />
                <span className="text-xs font-mono uppercase tracking-widest">DO TOP Philosophy</span>
              </div>
            </div>
            
            <div className="mt-24 flex justify-between items-end">
              <div className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.4em]">
                Based in Beijing / Shanghai<br />
                Serving the World
              </div>
              <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                <Activity size={32} className="text-brand-orange" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <Logo className="w-16" />
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">© 2026 DO TOP SOUND ARCHITECTS</span>
        </div>
        <div className="flex gap-8 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Instagram</a>
        </div>
      </footer>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-orange text-black p-12 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-widest">Navigation Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-4 hover:bg-black/10 rounded-full transition-colors">
                <X size={40} />
              </button>
            </div>
            
            <div className="flex flex-col gap-4">
              {['About', 'Projects', 'Team', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[12vw] font-black leading-none tracking-tighter uppercase hover:italic transition-all"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="flex justify-between items-end">
              <div className="max-w-xs">
                <p className="text-sm font-bold mb-4">想要打造极致声场？</p>
                <p className="text-xs opacity-70">联系我们，开启你的顶级听觉之旅。</p>
              </div>
              <div className="text-right font-mono text-[10px] uppercase tracking-widest">
                DO TOP / 渡头文化<br />
                EST. 2018
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
