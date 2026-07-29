import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import B from '../imports/branding-login/index';
import TargetCursor from './components/TargetCursor';
import PixelBlast from './components/PixelBlast';
import './components/PixelBlast.css';
import { Toaster, toast } from 'sonner';
import svgPaths from '../imports/branding-login/svg-6mc43d5pkl';
import { Search, ChevronDown, ChevronLeft, ChevronRight, BookOpen, Code2, List, Play, RotateCcw, CheckCircle2, Sun, Moon, Bookmark, Users, Gauge, Clock3, Building2, BadgeCheck } from 'lucide-react';

const HOME_DESIGN_WIDTH = 1920;
const HOME_DESIGN_HEIGHT = 1080;
const HOME_SOURCE_SIDEBAR_WIDTH = 230;
const HOME_CONTENT_WIDTH = HOME_DESIGN_WIDTH - HOME_SOURCE_SIDEBAR_WIDTH;
const NAV_ITEMS = ['홈', 'VOD', '프로젝트', '커뮤니티', '역량진단', '학습 여정', '마이페이지', '서비스 소개'];
const FILTERS = ['전체', '1주일', '2주일', '3주일', '4주 이상'];
const imgProfile = '/profile-soldier.png';

type Page = 'home' | 'vod' | 'course' | 'classroom' | 'project' | 'projectDetail' | 'mypage';
type NavigateFn = (navIndex: number) => void;
type ThemeMode = 'dark' | 'light';

const ThemeContext = createContext<{ mode: ThemeMode; toggle: () => void }>({
  mode: 'dark',
  toggle: () => undefined,
});

function PageFade({ page, mobile = false, children }: { page: Page; mobile?: boolean; children: React.ReactNode }) {
  const [displayPage, setDisplayPage] = useState(page);
  const [visible, setVisible] = useState(true);
  const previousChildren = useRef(children);

  if (page === displayPage) previousChildren.current = children;

  useEffect(() => {
    if (page === displayPage) return;
    setVisible(false);
    const swapTimer = window.setTimeout(() => {
      previousChildren.current = children;
      setDisplayPage(page);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => setVisible(true)));
    }, 220);
    return () => window.clearTimeout(swapTimer);
  }, [children, displayPage, page]);

  return (
    <div
      data-page-transition={displayPage}
      className={`${mobile ? 'min-h-[100dvh] w-full' : 'absolute inset-0 size-full'} transition-opacity duration-[220ms] ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {page === displayPage ? children : previousChildren.current}
    </div>
  );
}

function ThemeToggle({ floating = false }: { floating?: boolean }) {
  const { mode, toggle } = useContext(ThemeContext);
  const isLight = mode === 'light';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? '다크 모드로 전환' : '라이트 모드로 전환'}
      title={isLight ? '다크 모드' : '라이트 모드'}
      className={`cursor-target flex items-center justify-center size-10 rounded-[14px] border backdrop-blur-md transition-colors ${
        floating ? 'fixed right-5 top-5 z-[70] shadow-xl' : ''
      } ${isLight ? 'bg-white/85 border-black/10 text-[#24272d] hover:bg-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}`}
    >
      {isLight ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}

// ─── Icon primitives ─────────────────────────────────────────────────────────
const sw  = (c: string) => ({ stroke: c, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: '1.37' });
const sw1 = (c: string) => ({ stroke: c, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: '1.25' });
function Ico({ size = 16, children }: { size?: number; children: React.ReactNode }) {
  return <svg viewBox={`0 0 ${size} ${size}`} fill="none" style={{ width: size, height: size, flexShrink: 0 }}>{children}</svg>;
}
function Logo({ onClick }: { onClick?: () => void }) {
  const mark = (
    <svg viewBox="0 0 111.999 40.538" fill="none" style={{ height: '40.538px', width: '111.999px', flexShrink: 0 }}>
      {[svgPaths.p3b1b4600, svgPaths.p2f19c00, svgPaths.p24c880, svgPaths.p23163e00, svgPaths.p35a2b6b0]
        .map((d, i) => <path key={i} d={d} fill="white" />)}
    </svg>
  );
  if (!onClick) return mark;
  return (
    <button type="button" className="cursor-target rounded-lg focus-visible:outline-2 focus-visible:outline-[#b4ff39]" onClick={onClick} aria-label="홈으로 이동">
      {mark}
    </button>
  );
}
const navIconFns: ((c: string) => React.ReactNode)[] = [
  c => <Ico size={16.4}><path d={svgPaths.p1a90b700} {...sw(c)}/><path d={svgPaths.ped0c780} {...sw(c)}/><path d={svgPaths.p231f1a00} {...sw(c)}/><path d={svgPaths.p1b768f00} {...sw(c)}/></Ico>,
  c => <Ico size={16.4}><path d={svgPaths.p18274b00} {...sw(c)}/><path d="M15.0315 6.83555V10.9355" {...sw(c)}/><path d={svgPaths.p342fda80} {...sw(c)}/></Ico>,
  c => <Ico size={16.4}><path d={svgPaths.p6d380} {...sw(c)}/><path d={svgPaths.p18b60c00} {...sw(c)}/><path d={svgPaths.p209bdd00} {...sw(c)}/></Ico>,
  c => <Ico size={16.4}><path d={svgPaths.p2cc1eb00} {...sw(c)}/><path d={svgPaths.p15125b00} {...sw(c)}/><path d={svgPaths.pb4ac0c0} {...sw(c)}/><path d={svgPaths.p35e39380} {...sw(c)}/><path d="M8.19838 8.20042V5.46709" {...sw(c)}/></Ico>,
  c => <Ico size={16.4}><path d={svgPaths.p13b417f0} {...sw(c)}/><path d={svgPaths.pf047b20} {...sw(c)}/></Ico>,
  c => <Ico size={16.4}><path d={svgPaths.p103e1f80} {...sw(c)}/><path d="M5.46688 6.82908V9.56241" {...sw(c)}/><path d="M8.19838 6.82908V8.19574" {...sw(c)}/><path d="M10.932 6.82908V10.9291" {...sw(c)}/></Ico>,
  c => <Ico size={16.4}><path d={svgPaths.p3a63f700} {...sw(c)}/><path d={svgPaths.p186fcec0} {...sw(c)}/></Ico>,
  c => <svg viewBox="0 0 12.3 15.03" fill="none" style={{ width: 12, height: 15, flexShrink: 0 }}><path d={svgPaths.p1dc22700} {...sw(c)}/></svg>,
];

// ─── AI 교관 bottom card (shared) ─────────────────────────────────────────────
function AiCoachCard() {
  return (
    <div className="mx-3 mb-5 rounded-[16px] bg-white/[0.12] p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Ico size={16.4}>{[svgPaths.p1dd92e00,svgPaths.p24a05780,svgPaths.p1251e900,svgPaths.p22d0a400,svgPaths.p1eca780,svgPaths.p1f41fa00,svgPaths.p235e000,svgPaths.p3e167b00,svgPaths.p24243880].map((d,i)=><path key={i} d={d} {...sw('#B4FF39')}/>)}</Ico>
        <span style={{ fontFamily: 'Pretendard,sans-serif', fontSize: 12, fontWeight: 600, color: 'white' }}>AI 교관</span>
      </div>
      <p style={{ fontFamily: 'Pretendard,sans-serif', fontSize: 11, color: '#a1a1a1', lineHeight: '1.65' }}>학습 중 막히는 부분이 있다면 언제든 AI 교관에게 질문하세요.</p>
      <button className="cursor-target w-full bg-[#a1a1a1] hover:bg-white transition-colors rounded-[10px] py-2 text-[12px] font-semibold text-[#1a1d21]"
        style={{ fontFamily: 'Pretendard,sans-serif' }}
        onClick={() => toast('AI 교관', { description: 'AI 교관과 질문 세션을 시작합니다', duration: 2000 })}>
        질문 시작하기
      </button>
    </div>
  );
}

// ─── Shared Sidebar nav list ──────────────────────────────────────────────────
function SidebarNav({ activeNav, navigate, onClose }: { activeNav: number; navigate: NavigateFn; onClose?: () => void }) {
  const go = (i: number) => {
    navigate(i);
    toast(NAV_ITEMS[i], { description: `${NAV_ITEMS[i]} 페이지로 이동합니다`, duration: 1400 });
    onClose?.();
  };
  return (
    <nav className="flex-1 overflow-y-auto px-[17px] py-2 flex flex-col gap-[5px]">
      {NAV_ITEMS.map((label, i) => {
        const active = activeNav === i;
        return (
          <button key={i} onClick={() => go(i)}
            className={['cursor-target w-full flex items-center gap-3 px-3 py-[11px] rounded-[14px] text-left transition-all', active ? 'bg-[rgba(180,255,57,0.1)] outline outline-1 outline-[rgba(180,255,57,0.2)]' : 'hover:bg-white/[0.04]'].join(' ')}>
            {navIconFns[i](active ? '#B4FF39' : 'white')}
            <span style={{ fontFamily: 'Pretendard,sans-serif', fontSize: 14, lineHeight: '20px', color: active ? '#B4FF39' : 'white', fontWeight: active ? 600 : 400 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Desktop Sidebar (for VOD page) ───────────────────────────────────────────
function VodDesktopSidebar({ activeNav, navigate, onLogoClick }: { activeNav: number; navigate: NavigateFn; onLogoClick?: () => void }) {
  return (
    <aside className="w-[271px] h-full bg-black flex flex-col shrink-0 rounded-r-[32px] relative">
      <div className="absolute inset-0 rounded-r-[32px] pointer-events-none shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.04)]" />
      <div className="px-6 pt-8 pb-4"><Logo onClick={onLogoClick ?? (() => navigate(0))} /></div>
      <SidebarNav activeNav={activeNav} navigate={navigate} />
      <AiCoachCard />
    </aside>
  );
}

// ─── Mobile Sidebar drawer ────────────────────────────────────────────────────
function MobileSidebar({ isOpen, onClose, activeNav, navigate }: {
  isOpen: boolean; onClose: () => void; activeNav: number; navigate: NavigateFn;
}) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />}
      <aside className={['fixed top-0 left-0 z-50 h-full w-[230px] bg-black flex flex-col', 'rounded-r-[32px]', 'transition-transform duration-300 ease-out', isOpen ? 'translate-x-0' : '-translate-x-full'].join(' ')}>
        <div className="absolute inset-0 rounded-r-[32px] pointer-events-none shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.04)]" />
        <div className="flex items-center justify-between px-6 pt-7 pb-2">
          <Logo onClick={() => { navigate(0); onClose(); }} />
          <button className="cursor-target text-white/40 hover:text-white p-1 rounded-lg" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" width={16} height={16}><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <SidebarNav activeNav={activeNav} navigate={navigate} onClose={onClose} />
        <AiCoachCard />
      </aside>
    </>
  );
}

// ─── Mobile Header ────────────────────────────────────────────────────────────
function MobileHeader({ onMenuOpen, navigate, onLogoClick }: { onMenuOpen: () => void; navigate: NavigateFn; onLogoClick?: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0c0c0d]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="flex items-center gap-3">
        <button className="cursor-target p-1.5 rounded-lg text-white/60 hover:text-white" onClick={onMenuOpen}>
          <svg viewBox="0 0 18 14" fill="none" width={20} height={16}><path d="M1 1H17M1 7H17M1 13H17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <Logo onClick={onLogoClick ?? (() => navigate(0))} />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="cursor-target relative size-9 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center"
          onClick={() => toast('알림', { duration: 1200 })}>
          <Ico size={15}><path d={svgPaths.p1523e9d8} {...sw1('rgba(255,255,255,0.7)')}/><path d={svgPaths.p9785900} {...sw1('rgba(255,255,255,0.7)')}/></Ico>
          <div className="absolute top-[7px] left-[23px] size-[6px] rounded-full bg-[#AAFF19] shadow-[0_0_4px_rgba(170,255,25,0.8)]" />
        </button>
        <button className="cursor-target flex items-center gap-2 rounded-[14px] bg-white/5 border border-white/10 pl-[9px] pr-3 py-[7px]"
          onClick={() => toast('프로필', { duration: 1200 })}>
          <div className="size-[28px] rounded-full overflow-hidden bg-black/60 shrink-0 relative">
            <img src={imgProfile} alt="김철수 상병 프로필" className="absolute inset-0 size-full object-cover object-top" />
          </div>
          <span className="text-[12px] font-bold text-white" style={{ fontFamily: 'Noto Sans KR,sans-serif' }}>로그인</span>
        </button>
      </div>
    </header>
  );
}

// ─── Course data ──────────────────────────────────────────────────────────────
type BadgeType = 'new' | 'free' | 'top';
type Course = { id: number; topic: string; bg: string; badge?: string; badgeType?: BadgeType; title: string; desc: string; duration: string; enrolled: string; tags: string[]; };

const COURSES: Course[] = [
  { id:1,  topic:'Data',          bg:'linear-gradient(135deg,#7c3aed,#c026d3,#ec4899)', badge:'신', badgeType:'new',  title:'업무에 바로 쓰는 Claude Design 기반 보고서 PPT 만들기', desc:'생성형 AI를 활용해 PPT 보고서를 자동으로 작성하고 나만의 포트폴리오로 만드는 방법을 배워보세요.', duration:'4주 이상', enrolled:'2,485', tags:['클로드','디자인'] },
  { id:2,  topic:'Cloud',         bg:'linear-gradient(135deg,#2563eb,#06b6d4)',          badge:'무', badgeType:'free', title:'생성형 AI를 통한 Google Flow 강의 보고서 만들기', desc:'구글 AI 도구를 활용하여 업무 효율을 높이는 방법을 단계별로 알아봅니다.', duration:'2주일', enrolled:'1,832', tags:['구글','클라우드'] },
  { id:3,  topic:'Python',        bg:'linear-gradient(135deg,#059669,#10b981,#34d399)',   badge:'무', badgeType:'free', title:'chatGPT와 Gemini 사용법 비교하고 실습으로 익히기', desc:'대표적인 생성형 AI 도구들을 직접 비교하며 각 도구의 강점을 파악합니다.', duration:'1주일', enrolled:'3,201', tags:['파이썬','AI기초'] },
  { id:4,  topic:'Deep Learning', bg:'linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)',  badge:'신', badgeType:'new',  title:'LLM 활용 서비스를 빠르게 개선하는 협업 이력 활용법', desc:'LLM 기반 서비스의 품질을 높이는 협업 방법론과 이력 관리 기법을 소개합니다.', duration:'3주일', enrolled:'987',   tags:['딥러닝','LLM'] },
  { id:5,  topic:'AI',            bg:'linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)',  badge:'상', badgeType:'top',  title:'Claude Skills로 빠르게 배우는 AI 자동화 업무 플로우', desc:'Claude의 다양한 기능을 활용해 반복 업무를 자동화하고 생산성을 극대화합니다.', duration:'4주 이상', enrolled:'5,124', tags:['클로드','자동화'] },
  { id:6,  topic:'Data',          bg:'linear-gradient(135deg,#9333ea,#ec4899)',           badge:'무', badgeType:'free', title:'데이터 분석을 위한 Claude 프롬프트 엔지니어링 실전', desc:'데이터 분석 업무에 특화된 프롬프트 작성법을 실습 위주로 학습합니다.', duration:'2주일', enrolled:'2,089', tags:['데이터','프롬프트'] },
  { id:7,  topic:'Cloud',         bg:'linear-gradient(135deg,#0ea5e9,#6366f1)',                                          title:'전교사기 기초 - AWS와 함께하는 클라우드 입문', desc:'클라우드 서비스의 기본 개념부터 실제 배포까지 초보자도 쉽게 배울 수 있습니다.', duration:'3주일', enrolled:'1,567', tags:['AWS','클라우드'] },
  { id:8,  topic:'Python',        bg:'linear-gradient(135deg,#16a34a,#4ade80)',            badge:'상', badgeType:'top',  title:'소프트웨어 개발자를 위한 AI 개발 강좌', desc:'개발자 관점에서 AI를 활용한 코드 작성, 디버깅, 최적화 방법을 배웁니다.', duration:'4주 이상', enrolled:'4,332', tags:['파이썬','개발'] },
  { id:9,  topic:'Deep Learning', bg:'linear-gradient(135deg,#ea580c,#facc15)',                                           title:'딥러닝 AI - 기초부터 실전까지', desc:'신경망의 기초 개념부터 실제 프로젝트 적용까지 체계적으로 학습합니다.', duration:'4주 이상', enrolled:'2,714', tags:['딥러닝','신경망'] },
  { id:10, topic:'AI',            bg:'linear-gradient(135deg,#db2777,#a855f7)',            badge:'신', badgeType:'new',  title:'MySQL 통계분석 - MySQL을 통한 데이터 요약 및 완전 가이드', desc:'MySQL을 활용한 통계 분석 기법을 업무에 바로 적용할 수 있도록 실습합니다.', duration:'3주일', enrolled:'1,123', tags:['DB','통계'] },
  { id:11, topic:'Data',          bg:'linear-gradient(135deg,#7c3aed,#818cf8)',            badge:'무', badgeType:'free', title:'커뮤니티 데이터 분석 및 시각화 - 인사이트를 뽑아내는 법', desc:'데이터 시각화 도구를 활용해 인사이트를 효과적으로 전달하는 방법을 배웁니다.', duration:'2주일', enrolled:'876',   tags:['시각화','분석'] },
  { id:12, topic:'Cloud',         bg:'linear-gradient(135deg,#0891b2,#2563eb)',            badge:'신', badgeType:'new',  title:'AI의 차기 기술 트렌드 - 현장에서 직접 배우는 실전 AI', desc:'AI 기술 트렌드를 빠르게 파악하고 실무에 적용하는 전략을 소개합니다.', duration:'1주일', enrolled:'3,456', tags:['AI트렌드','기술'] },
];

// ─── Course curriculum helper ─────────────────────────────────────────────────
function getCurriculumChapters(course: Course) {
  return [
    `${course.topic} 기초 개념과 핵심 원리 이해`,
    '환경 설정 및 실습 도구 준비',
    '핵심 기능 실습 — Part 1',
    '핵심 기능 실습 — Part 2',
    '실전 프로젝트 적용 가이드',
    '마무리 정리 및 다음 학습 경로',
  ];
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course, compact, onOpen }: { course: Course; compact?: boolean; onOpen?: (c: Course) => void }) {
  const accent = course.badgeType === 'new' ? '#f59e0b' : course.badgeType === 'free' ? '#3867c8' : '#7c3aad';
  const level = course.badgeType === 'new' ? 'Basic (초급)' : course.badgeType === 'free' ? 'Intermediate (중급)' : 'Advanced (고급)';

  return (
    <button
      className="page-card-reveal text-left flex flex-col rounded-[16px] overflow-hidden border border-white/[0.06] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] hover:border-white/[0.1] transition-all duration-200 group"
      onClick={() => onOpen ? onOpen(course) : toast(course.topic, { description: '강의를 시작합니다', duration: 1500 })}>
      <div className="relative h-[72px] flex items-center justify-between px-5" style={{ background: accent }}>
        <Bookmark size={18} className="text-white" />
        <span className="rounded-full bg-[#111214] text-white text-[10px] px-3 py-1.5 flex items-center gap-1"><Users size={12} /> {course.enrolled}명 수강중</span>
      </div>
      <div className={`flex flex-col gap-3 flex-1 ${compact ? 'p-3.5' : 'p-5'}`}>
        <h3 className={`font-semibold leading-[1.35] line-clamp-2 ${compact ? 'text-[12px]' : 'text-[15px]'} text-white`} style={{ fontFamily: 'Pretendard,sans-serif', borderLeft: `4px solid ${accent}`, paddingLeft: 12 }}>{course.title}</h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {course.tags.map(t => (
            <span key={t} className="bg-white/[0.06] text-[#a6a6aa] text-[10px] px-[6px] py-[2px] rounded-[4px]"
              style={{ fontFamily: 'Pretendard,sans-serif' }}>{t}</span>
          ))}
        </div>
        <div className="space-y-2 text-[11px] text-[#c8c8cb]" style={{ fontFamily: 'Pretendard,sans-serif' }}>
          <div className="flex items-center gap-2"><Gauge size={15} className="text-white/45" /> 강의레벨 <strong style={{ color: accent }}>{level}</strong></div>
          <div className="flex items-center gap-2"><Clock3 size={15} className="text-white/45" /> 이수시간 <span>15시간</span></div>
          <div className="flex items-center gap-2"><Building2 size={15} className="text-white/45" /> 제공기관 <span>Kacademy</span></div>
          <div className="flex items-center gap-2"><BadgeCheck size={15} className="text-white/45" /> 수료증 <span>제공</span></div>
        </div>
        <div className="flex justify-end mt-auto pt-1">
          <span className="rounded-full border px-4 py-2 text-[11px] font-semibold transition-colors hover:bg-[#aaff19] hover:text-[#111214]" style={{ color:'#aaff19', borderColor:'#aaff19', fontFamily:'Pretendard,sans-serif' }}>신청하기</span>
        </div>
      </div>
    </button>
  );
}

// ─── VOD Content (shared between desktop & mobile) ────────────────────────────
function VodContent({ compact, onOpenCourse }: { compact?: boolean; onOpenCourse?: (c: Course) => void }) {
  const [activeFilter, setActiveFilter] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = COURSES.filter(c =>
    (activeFilter === 0 || c.duration === FILTERS[activeFilter]) &&
    (search === '' || c.title.toLowerCase().includes(search) || c.topic.toLowerCase().includes(search))
  );

  return (
    <div className={compact ? 'px-4 pt-6 pb-10' : 'px-8 pt-10 pb-10 max-w-[1200px] mx-auto'}>
      {/* Header */}
      <div className={`${compact ? 'text-center mb-5' : 'text-center mb-8'}`}>
        <h1 className={`font-bold text-white ${compact ? 'text-[22px]' : 'text-[30px]'}`}
          style={{ fontFamily: 'Pretendard,sans-serif', letterSpacing: '-1px' }}>
          나에게 필요한 강의를 찾아보세요
        </h1>
        <p className={`mt-1.5 text-[#a6a6aa] ${compact ? 'text-[13px]' : 'text-[15px]'}`}
          style={{ fontFamily: 'Pretendard,sans-serif' }}>
          강의를 선택해서 AI를 학습할 수 있습니다
        </p>
      </div>

      {/* Search */}
      <div className={`relative ${compact ? 'mb-4' : 'max-w-[480px] mx-auto mb-6'}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
        <input
          className="w-full bg-white/[0.04] border border-white/[0.1] rounded-[12px] pl-9 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
          style={{ fontFamily: 'Pretendard,sans-serif', fontSize: compact ? 13 : 14 }}
          placeholder="강의를 검색해보세요"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className={`flex items-center gap-2 ${compact ? 'mb-4 overflow-x-auto pb-1' : 'mb-6'}`}>
        {FILTERS.map((f, i) => (
          <button key={i} onClick={() => setActiveFilter(i)}
            className={`cursor-target shrink-0 px-4 py-[6px] rounded-full text-[12px] font-medium transition-all ${activeFilter === i ? 'bg-[rgba(170,255,25,0.1)] text-[#aaff19] border border-[rgba(170,255,25,0.25)]' : 'bg-white/[0.04] text-[#a6a6aa] border border-white/[0.06] hover:bg-white/[0.08]'}`}
            style={{ fontFamily: 'Pretendard,sans-serif' }}>
            {f}
          </button>
        ))}
        {!compact && (
          <button className="cursor-target ml-auto flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-[10px] px-3 py-[6px] hover:bg-white/[0.08] transition-colors">
            <span className="text-[#a6a6aa] text-[12px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>최신순</span>
            <ChevronDown size={13} className="text-white/40" />
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#555]" style={{ fontFamily: 'Pretendard,sans-serif', fontSize: 14 }}>검색 결과가 없습니다</div>
      ) : (
        <div className={`grid gap-4 mb-8 ${compact ? 'grid-cols-2 gap-3' : 'grid-cols-4'}`}>
          {filtered.map(c => <CourseCard key={c.id} course={c} compact={compact} onOpen={onOpenCourse} />)}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1">
        {!compact && (
          <button className="cursor-target size-8 flex items-center justify-center rounded-[8px] bg-white/[0.04] text-white/40 hover:bg-white/[0.08] transition-colors">
            <ChevronLeft size={13} />
          </button>
        )}
        {[1,2,3,4,5].map(n => (
          <button key={n}
            className={`cursor-target size-8 flex items-center justify-center rounded-[8px] text-[13px] font-medium transition-all ${n === 1 ? 'bg-[rgba(170,255,25,0.1)] text-[#aaff19]' : 'bg-white/[0.04] text-[#a6a6aa] hover:bg-white/[0.08]'}`}
            style={{ fontFamily: 'Pretendard,sans-serif' }}>
            {n}
          </button>
        ))}
        {!compact && (
          <button className="cursor-target size-8 flex items-center justify-center rounded-[8px] bg-white/[0.04] text-white/40 hover:bg-white/[0.08] transition-colors">
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Desktop VOD page ─────────────────────────────────────────────────────────
function VodDesktopPage({ navigate, activeNav, openCourse }: { navigate: NavigateFn; activeNav: number; openCourse: (c: Course) => void }) {
  return (
    <div className="flex w-full h-full bg-[#0c0c0d]">
      <VodDesktopSidebar activeNav={activeNav} navigate={navigate} />
      <main className="flex-1 overflow-y-auto">
        <VodContent onOpenCourse={openCourse} />
      </main>
    </div>
  );
}

// ─── Mobile VOD page ──────────────────────────────────────────────────────────
function MobileVodView({ navigate, activeNav, openCourse }: { navigate: NavigateFn; activeNav: number; openCourse: (c: Course) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#0c0c0d]">
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav={activeNav} navigate={navigate} />
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} navigate={navigate} />
      <VodContent compact onOpenCourse={openCourse} />
    </div>
  );
}

// ─── Course Detail ────────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg viewBox="0 0 10 12" fill="none" width={9} height={10}>
      <path d="M1 1.5L9 6L1 10.5V1.5Z" fill="white" />
    </svg>
  );
}

function CourseInfoCard({ course }: { course: Course }) {
  return (
    <div className="rounded-[20px] bg-[rgba(255,255,255,0.03)] border border-white/[0.08] overflow-hidden">
      {/* Thumbnail */}
      <div className="h-[130px] flex items-center justify-center" style={{ background: course.bg }}>
        <span className="text-white font-black text-[30px] drop-shadow-lg" style={{ fontFamily: 'Pretendard,sans-serif' }}>{course.topic}</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-3">
          {[
            { label: '수강 기간', value: '2026-01-01 ~ 2026-12-31' },
            { label: '수강 시작', value: '2026-01-01 ~ 2026-12-31' },
            { label: '교육 방식', value: '온라인 자기 주도 학습' },
            { label: '총 강의', value: `6개 모듈 · ${course.duration}` },
          ].map(row => (
            <div key={row.label} className="flex items-start justify-between gap-3">
              <span className="text-[#555] text-[12px] shrink-0" style={{ fontFamily: 'Pretendard,sans-serif' }}>{row.label}</span>
              <span className="text-[#c0c0c0] text-[12px] text-right leading-[1.4]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06] pt-4">
          <p className="text-white text-[13px] font-semibold mb-4 leading-[1.5]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{course.title}</p>
          <button
            className="cursor-target w-full bg-[#aaff19] hover:bg-[#c8ff50] active:scale-[0.98] transition-all rounded-[12px] h-[48px] font-bold text-[14px] text-[#0c0c0d]"
            style={{ fontFamily: 'Pretendard,sans-serif' }}
            onClick={() => toast('수강 신청 완료', { description: `${course.title}`, duration: 2000 })}>
            수강 신청
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseDetailBody({ course, onBack, onStartLesson, mobile }: { course: Course; onBack: () => void; onStartLesson: (moduleIndex: number) => void; mobile?: boolean }) {
  const [openChapter, setOpenChapter] = useState<number | null>(null);
  const chapters = getCurriculumChapters(course);
  const modules = [
    { title: course.title, desc: course.desc, duration: '15분' },
    { title: `${course.topic} 핵심 기능 심화 실습`, desc: '핵심 개념을 반복 실습으로 완전히 내 것으로 만들어 봅니다.', duration: '20분' },
    { title: '실전 프로젝트 적용 가이드', desc: '배운 내용을 실제 업무에 어떻게 활용할 수 있는지 알아봅니다.', duration: '18분' },
  ];

  const px = mobile ? 'px-4' : 'px-10';
  const sectionPad = mobile ? 'p-5' : 'p-6';
  const titleSize = mobile ? 'text-[14px]' : 'text-[16px]';

  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative">
        <div className="absolute inset-0" style={{ background: course.bg }} />
        <div className="absolute inset-0 bg-black/55" />
        <div className={`relative ${px} pt-6 pb-10`}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-5 text-[12px] text-white/45" style={{ fontFamily: 'Pretendard,sans-serif' }}>
            <button className="cursor-target hover:text-white/70 transition-colors" onClick={onBack}>홈</button>
            <span>/</span>
            <button className="cursor-target hover:text-white/70 transition-colors" onClick={onBack}>VOD</button>
            <span>/</span>
            <span className="text-white/70 line-clamp-1">{course.title}</span>
          </div>
          <h1 className={`font-bold text-white leading-[1.3] mb-3 ${mobile ? 'text-[20px]' : 'text-[28px]'}`}
            style={{ fontFamily: 'Pretendard,sans-serif', letterSpacing: '-0.8px' }}>
            {course.title}
          </h1>
          <p className={`text-white/65 leading-[1.7] mb-5 ${mobile ? 'text-[13px] line-clamp-3' : 'text-[14px] max-w-[640px]'}`}
            style={{ fontFamily: 'Pretendard,sans-serif' }}>
            {course.desc}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              course.badge ? (course.badge === '신' ? '신규' : course.badge === '무' ? '무료' : '상위') : null,
              course.duration, '비전공자', ...course.tags,
            ].filter(Boolean).map((t, i) => (
              <span key={i} className="bg-white/[0.12] text-white/80 text-[11px] px-3 py-[5px] rounded-full border border-white/10"
                style={{ fontFamily: 'Pretendard,sans-serif' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      {mobile ? (
        /* Mobile: stacked, info card first */
        <div className="px-4 pt-5 pb-10 space-y-4">
          {/* Info card */}
          <div className="page-card-reveal rounded-[16px] bg-[rgba(255,255,255,0.03)] border border-white/[0.08] p-4 space-y-3">
            <div className="grid grid-cols-2 gap-y-3">
              {[
                { label: '수강 기간', value: '2026-01-01\n~ 2026-12-31' },
                { label: '총 강의', value: `6개 모듈\n${course.duration}` },
                { label: '교육 방식', value: '온라인\n자기 주도' },
                { label: '난이도', value: '비전공자\n입문' },
              ].map(r => (
                <div key={r.label}>
                  <p className="text-[#555] text-[10px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{r.label}</p>
                  <p className="text-[#c0c0c0] text-[11px] font-medium mt-0.5 leading-[1.4] whitespace-pre-line" style={{ fontFamily: 'Pretendard,sans-serif' }}>{r.value}</p>
                </div>
              ))}
            </div>
            <button className="cursor-target w-full bg-[#aaff19] hover:bg-[#c8ff50] transition-colors rounded-[11px] h-[44px] font-bold text-[13px] text-[#0c0c0d]"
              style={{ fontFamily: 'Pretendard,sans-serif' }}
              onClick={() => toast('수강 신청 완료', { description: course.title, duration: 2000 })}>
              수강 신청
            </button>
          </div>
          {/* 강의 소개 */}
          <section className={`page-card-reveal rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] ${sectionPad}`}>
            <h2 className={`${titleSize} font-bold text-white mb-3`} style={{ fontFamily: 'Pretendard,sans-serif' }}>강의 소개</h2>
            <p className="text-[#a6a6aa] text-[13px] leading-[1.8]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{course.desc}</p>
          </section>
          {/* 학습 콘텐츠 */}
          <section className={`page-card-reveal rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] ${sectionPad}`}>
            <h2 className={`${titleSize} font-bold text-white mb-3`} style={{ fontFamily: 'Pretendard,sans-serif' }}>학습 콘텐츠</h2>
            <div className="space-y-2.5">
              {modules.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-[10px] bg-white/[0.02] border border-white/[0.04]">
                  <div className="size-7 rounded-full shrink-0 flex items-center justify-center" style={{ background: course.bg }}>
                    <PlayIcon />
                  </div>
                  <p className="text-[#d1d1d1] text-[12px] flex-1 line-clamp-1" style={{ fontFamily: 'Pretendard,sans-serif' }}>{m.title}</p>
                  <button className="cursor-target bg-[rgba(170,255,25,0.1)] hover:bg-[rgba(170,255,25,0.18)] text-[#aaff19] text-[10px] font-semibold px-2.5 py-[4px] rounded-[6px] shrink-0 transition-colors"
                    style={{ fontFamily: 'Pretendard,sans-serif' }}
                    onClick={() => onStartLesson(i)}>
                    시작
                  </button>
                </div>
              ))}
            </div>
          </section>
          {/* 학습 목차 */}
          <section className={`page-card-reveal rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] ${sectionPad}`}>
            <h2 className={`${titleSize} font-bold text-white mb-1`} style={{ fontFamily: 'Pretendard,sans-serif' }}>학습 목차</h2>
            <p className="text-[#555] text-[11px] mb-3" style={{ fontFamily: 'Pretendard,sans-serif' }}>{chapters.length}개 챕터</p>
            <div className="space-y-2">
              {chapters.map((ch, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-[9px] bg-white/[0.02] border border-white/[0.04]">
                  <span className="size-5 rounded-full bg-white/[0.08] text-white/35 text-[9px] flex items-center justify-center shrink-0 font-bold">{i + 1}</span>
                  <span className="text-[#a6a6aa] text-[12px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{ch}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* Desktop: 2-column */
        <div className="max-w-[1100px] mx-auto px-10 py-8 flex gap-7 items-start">
          {/* Left */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* 강의 소개 */}
            <section className={`page-card-reveal rounded-[18px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] ${sectionPad}`}>
              <h2 className={`${titleSize} font-bold text-white mb-4`} style={{ fontFamily: 'Pretendard,sans-serif' }}>강의 소개</h2>
              <p className="text-[#a6a6aa] text-[14px] leading-[1.85]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{course.desc}</p>
              <p className="text-[#a6a6aa] text-[14px] leading-[1.85] mt-3" style={{ fontFamily: 'Pretendard,sans-serif' }}>
                실습을 통해 단계별로 학습하며, 강의가 끝난 후에는 실무에 바로 적용할 수 있는 능력을 갖출 수 있습니다. 각 모듈은 이론과 실습이 균형 있게 구성되어 있어 효율적인 학습이 가능합니다.
              </p>
            </section>
            {/* 학습 콘텐츠 */}
            <section className={`page-card-reveal rounded-[18px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] ${sectionPad}`}>
              <h2 className={`${titleSize} font-bold text-white mb-4`} style={{ fontFamily: 'Pretendard,sans-serif' }}>학습 콘텐츠</h2>
              <div className="space-y-3">
                {modules.map((m, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-[12px] bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] transition-colors group/mod">
                    <div className="size-9 rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: course.bg }}>
                      <PlayIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-[13px] font-semibold leading-[1.4]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{m.title}</p>
                      <p className="text-[#737373] text-[12px] mt-1 line-clamp-1" style={{ fontFamily: 'Pretendard,sans-serif' }}>{m.desc}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[#555] text-[11px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{m.duration}</span>
                      <button className="cursor-target bg-[rgba(170,255,25,0.08)] hover:bg-[rgba(170,255,25,0.18)] text-[#aaff19] text-[11px] font-semibold px-3 py-[6px] rounded-[8px] transition-colors"
                        style={{ fontFamily: 'Pretendard,sans-serif' }}
                        onClick={() => onStartLesson(i)}>
                        강의 시작
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            {/* 학습 목차 */}
            <section className={`page-card-reveal rounded-[18px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] ${sectionPad}`}>
              <h2 className={`${titleSize} font-bold text-white mb-1`} style={{ fontFamily: 'Pretendard,sans-serif' }}>학습 목차</h2>
              <p className="text-[#555] text-[12px] mb-4" style={{ fontFamily: 'Pretendard,sans-serif' }}>{chapters.length}개 챕터</p>
              <div className="space-y-2">
                {chapters.map((ch, i) => (
                  <button key={i}
                    className="cursor-target w-full flex items-center justify-between px-4 py-3 rounded-[11px] bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all text-left"
                    onClick={() => setOpenChapter(openChapter === i ? null : i)}>
                    <div className="flex items-center gap-3">
                      <span className="size-[22px] rounded-full bg-white/[0.07] text-white/35 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="text-[#c0c0c0] text-[13px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{ch}</span>
                    </div>
                    <ChevronDown size={14} className={`text-white/25 transition-transform duration-200 ${openChapter === i ? 'rotate-180' : ''}`} />
                  </button>
                ))}
              </div>
            </section>
          </div>
          {/* Right: info sidebar */}
          <div className="w-[290px] shrink-0 sticky top-6">
            <CourseInfoCard course={course} />
          </div>
        </div>
      )}
    </div>
  );
}

function CourseDetailDesktopPage({ course, navigate, activeNav, goBack, onStartLesson }: { course: Course; navigate: NavigateFn; activeNav: number; goBack: () => void; onStartLesson: (moduleIndex: number) => void }) {
  return (
    <div className="flex w-full h-full bg-[#0c0c0d]">
      <VodDesktopSidebar activeNav={activeNav} navigate={navigate} />
      <main className="flex-1 overflow-y-auto">
        <CourseDetailBody course={course} onBack={goBack} onStartLesson={onStartLesson} />
      </main>
    </div>
  );
}

function CourseDetailMobileView({ course, navigate, activeNav, goBack, onStartLesson }: { course: Course; navigate: NavigateFn; activeNav: number; goBack: () => void; onStartLesson: (moduleIndex: number) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#0c0c0d]">
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav={activeNav} navigate={navigate} />
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} navigate={navigate} />
      <CourseDetailBody course={course} onBack={goBack} onStartLesson={onStartLesson} mobile />
    </div>
  );
}

// ─── Three-pane classroom ─────────────────────────────────────────────────────
const starterCode = `# MILI AI 실습
# 실행 버튼을 눌러 결과를 확인하세요.

name = "김철수 상병"
topic = "생성형 AI 활용"

print(f"{name}님의 {topic} 학습을 시작합니다.")`;

function ClassroomLessonPane({ course, moduleIndex }: { course: Course; moduleIndex: number }) {
  const lessons = [
    course.title,
    `${course.topic} 핵심 기능 심화 실습`,
    '실전 프로젝트 적용 가이드',
  ];
  return (
    <section className="h-full min-h-0 flex flex-col bg-[#111316]">
      <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(180,255,57,0.08),transparent_34%),#15181c]">
        <div className="absolute inset-0 opacity-30" style={{ background: course.bg }} />
        <div className="relative text-center px-8 max-w-[540px]">
          <div className="mx-auto size-20 rounded-full border border-[#b4ff39]/30 bg-black/50 flex items-center justify-center shadow-[0_0_50px_rgba(180,255,57,0.12)]">
            <Play size={30} fill="#b4ff39" className="text-[#b4ff39] ml-1" />
          </div>
          <p className="mt-6 text-white text-xl font-bold leading-snug">{lessons[moduleIndex] ?? lessons[0]}</p>
          <p className="mt-2 text-white/40 text-sm">학습 영상을 선택하면 이 영역에서 재생됩니다.</p>
        </div>
      </div>
      <div className="h-[32%] min-h-[180px] border-t border-white/8 p-6 overflow-y-auto bg-[#0d0f12]">
        <span className="text-[11px] font-bold tracking-[0.18em] text-[#b4ff39]">MISSION {moduleIndex + 1}</span>
        <h2 className="mt-2 text-white text-xl font-bold">오늘의 학습 미션</h2>
        <p className="mt-3 text-[#969aa2] text-sm leading-7">
          제공된 예제 코드를 실행하고 결과를 확인해 보세요. 코드를 직접 수정한 뒤 다시 실행하면
          생성형 AI 활용 흐름을 단계별로 익힐 수 있습니다.
        </p>
      </div>
    </section>
  );
}

function ClassroomCodePane() {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState('실행 버튼을 누르면 결과가 여기에 표시됩니다.');
  const run = () => {
    setOutput('김철수 상병님의 생성형 AI 활용 학습을 시작합니다.\\n\\n✓ 코드가 정상적으로 실행되었습니다.');
    toast.success('실습 실행 완료');
  };
  return (
    <section className="h-full min-h-0 flex flex-col bg-[#0d1014] border-x border-white/8">
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/8 bg-[#14171b]">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[#b4ff39]/10 border border-[#b4ff39]/30 text-[#b4ff39] text-xs font-bold">Python</span>
          <span className="px-3 py-1.5 rounded-lg text-white/35 text-xs font-semibold">SQL</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="cursor-target p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5" onClick={() => setCode(starterCode)} aria-label="코드 초기화">
            <RotateCcw size={15} />
          </button>
          <button className="cursor-target flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b4ff39] text-black text-xs font-black hover:bg-[#c8ff50]" onClick={run}>
            <Play size={13} fill="currentColor" /> 실행
          </button>
        </div>
      </div>
      <textarea
        aria-label="Python 실습 코드"
        value={code}
        onChange={e => setCode(e.target.value)}
        spellCheck={false}
        className="flex-1 min-h-0 resize-none bg-[#0d1014] text-[#c8d1dc] font-mono text-sm leading-7 p-5 outline-none"
      />
      <div className="h-[28%] min-h-[140px] border-t border-white/8 bg-[#090b0e] p-4 overflow-auto">
        <p className="text-[11px] font-bold text-white/35 mb-3">실행 결과</p>
        <pre className="text-xs leading-6 whitespace-pre-wrap text-[#b4ff39]/80 font-mono">{output}</pre>
      </div>
    </section>
  );
}

function ClassroomCurriculumPane({ course, moduleIndex, onSelect }: { course: Course; moduleIndex: number; onSelect: (index: number) => void }) {
  const lessons = [
    course.title,
    `${course.topic} 핵심 기능 심화 실습`,
    '실전 프로젝트 적용 가이드',
  ];
  return (
    <section className="h-full min-h-0 flex flex-col bg-[#101216]">
      <div className="h-14 px-5 flex items-center border-b border-white/8">
        <List size={16} className="text-[#b4ff39]" />
        <h2 className="ml-2 text-white text-sm font-bold">학습 목차</h2>
        <span className="ml-auto text-white/30 text-xs">{moduleIndex + 1} / {lessons.length}</span>
      </div>
      <div className="p-5 border-b border-white/8">
        <div className="flex justify-between text-xs text-white/45"><span>전체 진도</span><span>33%</span></div>
        <div className="progress-track mt-2 h-1.5 rounded-full bg-white/8 overflow-hidden"><div className="h-full w-1/3 bg-[#b4ff39] rounded-full" /></div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
        {lessons.map((lesson, i) => (
          <button key={lesson} onClick={() => onSelect(i)}
            className={`cursor-target w-full text-left p-4 rounded-xl border transition-colors ${moduleIndex === i ? 'bg-[#b4ff39]/8 border-[#b4ff39]/25' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'}`}>
            <div className="flex items-start gap-3">
              <span className={`size-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${moduleIndex === i ? 'bg-[#b4ff39] text-black' : 'bg-white/8 text-white/40'}`}>{i + 1}</span>
              <div className="min-w-0">
                <p className={`text-xs leading-5 font-semibold ${moduleIndex === i ? 'text-white' : 'text-white/60'}`}>{lesson}</p>
                <p className="mt-1 text-[10px] text-white/30">{i === 0 ? '15분' : i === 1 ? '20분' : '18분'} · 영상 + 실습</p>
              </div>
              {i < moduleIndex && <CheckCircle2 size={14} className="ml-auto shrink-0 text-[#b4ff39]" />}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function ClassroomDesktop({ course, moduleIndex, onSelect, onClose, navigate }: { course: Course; moduleIndex: number; onSelect: (index: number) => void; onClose: () => void; navigate: NavigateFn }) {
  return (
    <div className="size-full flex flex-col bg-[#0c0e11] text-white">
      <header className="h-16 shrink-0 px-5 border-b border-white/8 bg-[#0b0d10] flex items-center">
        <Logo onClick={() => navigate(0)} />
        <p className="mx-auto max-w-[60%] truncate text-sm font-semibold text-white/55">{course.title}</p>
        <ThemeToggle />
        <button className="cursor-target px-4 py-2 rounded-xl border border-white/10 text-white/55 text-xs font-bold hover:text-white hover:bg-white/5" onClick={onClose}>× 닫기</button>
      </header>
      <main className="flex-1 min-h-0 grid grid-cols-[minmax(0,1.35fr)_minmax(360px,0.7fr)_minmax(300px,0.52fr)]">
        <ClassroomLessonPane course={course} moduleIndex={moduleIndex} />
        <ClassroomCodePane />
        <ClassroomCurriculumPane course={course} moduleIndex={moduleIndex} onSelect={onSelect} />
      </main>
    </div>
  );
}

function ClassroomMobile({ course, moduleIndex, onSelect, onClose, navigate }: { course: Course; moduleIndex: number; onSelect: (index: number) => void; onClose: () => void; navigate: NavigateFn }) {
  const [tab, setTab] = useState<'lesson' | 'code' | 'curriculum'>('lesson');
  const tabs = [
    { id: 'lesson' as const, label: '강의', icon: BookOpen },
    { id: 'code' as const, label: '실습', icon: Code2 },
    { id: 'curriculum' as const, label: '목차', icon: List },
  ];
  return (
    <div className="h-[100dvh] flex flex-col bg-[#0c0e11] text-white overflow-hidden">
      <header className="h-14 shrink-0 px-4 border-b border-white/8 flex items-center bg-[#0b0d10]">
        <button className="cursor-target text-white/55 text-sm font-bold" onClick={() => navigate(0)}>MILI AI</button>
        <p className="mx-4 flex-1 truncate text-xs text-white/45">{course.title}</p>
        <ThemeToggle />
        <button className="cursor-target text-xs text-white/55" onClick={onClose}>닫기</button>
      </header>
      <main className="flex-1 min-h-0">
        {tab === 'lesson' && <ClassroomLessonPane course={course} moduleIndex={moduleIndex} />}
        {tab === 'code' && <ClassroomCodePane />}
        {tab === 'curriculum' && <ClassroomCurriculumPane course={course} moduleIndex={moduleIndex} onSelect={onSelect} />}
      </main>
      <nav className="h-[72px] shrink-0 grid grid-cols-3 border-t border-white/10 bg-[#0b0d10] pb-[env(safe-area-inset-bottom)]">
        {tabs.map(item => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={() => setTab(item.id)} className={`cursor-target flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${active ? 'text-[#b4ff39]' : 'text-white/35'}`}>
              <Icon size={19} /><span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── Mobile home: 김철수 상병 카드 ────────────────────────────────────────────
function MobileArticleCard() {
  const statCards = [
    { icon: <Ico size={15}><path d={svgPaths.p19bd9680} {...sw1('#FF8904')}/></Ico>, label:'연속 학습', value:'21', sub:'리그 내 최고 기록!', onClick:()=>toast('연속 학습',{duration:1200}) },
    { icon: <Ico size={15}><path d={svgPaths.p1952b200} {...sw1('#FDC700')}/><path d={svgPaths.pff37200} {...sw1('#FDC700')}/><path d="M2.5 13.75H12.5" {...sw1('#FDC700')}/><path d={svgPaths.p2e2bdbe0} {...sw1('#FDC700')}/><path d={svgPaths.p265d3398} {...sw1('#FDC700')}/><path d={svgPaths.p3541b00} {...sw1('#FDC700')}/></Ico>, label:'탐사 배지', value:'3', sub:'총 10개 중', onClick:()=>toast('탐사 배지',{duration:1200}) },
    { icon: <Ico size={15}><path d={svgPaths.p185087f0} {...sw1('#AAFF19')}/><path d={svgPaths.pc274700} {...sw1('#AAFF19')}/></Ico>, label:'완료 미션', value:'4/10', sub:'이번 프로젝트 기준', onClick:()=>toast('완료 미션',{duration:1200}) },
    { icon: <Ico size={15}><path d={svgPaths.p185087f0} {...sw1('#51A2FF')}/><path d="M7.5 3.75V7.5L10 8.75" {...sw1('#51A2FF')}/></Ico>, label:'누적 학습', value:'18h', sub:'이번 달 총계', onClick:()=>toast('누적 학습',{duration:1200}) },
  ];
  return (
    <div className="page-card-reveal relative overflow-hidden bg-black/60 border border-white/[0.04] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.08)]">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="size-[52px] rounded-full overflow-hidden bg-black/60 shrink-0 relative mt-[2px]">
            <img src={imgProfile} alt="김철수 상병 프로필" className="absolute inset-0 size-full object-cover object-top" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[22px] font-bold text-white tracking-[-1.1px]" style={{ fontFamily:'Helvetica Neue,Noto Sans KR,sans-serif' }}>김철수 상병</span>
              <div className="bg-[rgba(162,162,162,0.08)] rounded-[8px] px-[8px] py-[5px]">
                <span className="text-[#51a2ff] text-[11px] tracking-[-0.22px]" style={{ fontFamily:'Helvetica Neue,Noto Sans KR,sans-serif', fontVariationSettings:'"wght" 400' }}>AI 탐사대원</span>
              </div>
            </div>
            <p className="mt-1 text-[#a6a6aa] text-[12px] tracking-[-0.1px]" style={{ fontFamily:'Pretendard,sans-serif', fontWeight:500 }}>
              상병 · 비전공 장병 · 체력 기록 관리 시스템 진행 중
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-10">
          {statCards.map((s,i) => (
            <button key={i} onClick={s.onClick}
              className="cursor-target text-left rounded-[14px] p-[13px] flex gap-[10px] items-start border border-white/[0.07]"
              style={{ background:'linear-gradient(146.59deg,rgba(255,255,255,0.035) 2.36%,rgba(255,255,255,0.01) 63.34%,rgba(183,245,47,0.01) 97.64%)' }}>
              <div className="pt-[2px]">{s.icon}</div>
              <div>
                <p className="text-[11px] font-bold text-white leading-[14px]" style={{ fontFamily:'Noto Sans KR,sans-serif' }}>{s.label}</p>
                <p className="text-[20px] font-black text-white leading-[34px]" style={{ fontFamily:'Orbitron,sans-serif' }}>{s.value}</p>
                <p className="text-[9px] text-[#d1d1d1] leading-[13px]" style={{ fontFamily:'Noto Sans KR,sans-serif' }}>{s.sub}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-[18px] rounded-[12px] px-[15px] py-4 border border-white/[0.07]"
          style={{ background:'linear-gradient(173.224deg,rgba(255,255,255,0.035) 2.36%,rgba(255,255,255,0.01) 63.34%,rgba(183,245,47,0.01) 97.64%)' }}>
          <div className="flex items-center justify-between mb-[10px]">
            <span className="text-[13px] font-black text-white" style={{ fontFamily:'Orbitron,sans-serif' }}>Lv. 23</span>
            <span className="text-[11px] font-bold text-white tracking-[-0.5px]" style={{ fontFamily:'Helvetica Neue,sans-serif' }}>84%</span>
          </div>
          <div className="progress-track bg-white/10 h-[7px] rounded-full overflow-hidden">
            <div className="h-full bg-[#AAFF19] rounded-full shadow-[0_0_14px_rgba(170,255,25,0.34)]" style={{ width:'84%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile home: 최근 프로젝트 카드 ──────────────────────────────────────────
function MobileRecentProjectCard({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="page-card-reveal relative overflow-hidden bg-[rgba(10,15,8,0.8)] border border-white/[0.04] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.04)]">
      <div className="p-5">
        <p className="text-[20px] font-bold text-white tracking-[-1px] mb-[24px]" style={{ fontFamily:'Helvetica Neue,Noto Sans KR,sans-serif' }}>최근 프로젝트</p>
        <div className="flex items-center gap-2">
          <div className="bg-[rgba(170,255,25,0.08)] rounded-[8px] px-[9px] py-[5px]">
            <span className="text-[#aaff19] text-[10px] font-bold tracking-[-0.288px]" style={{ fontFamily:'Pretendard,sans-serif' }}>진행 중</span>
          </div>
          <span className="text-[#737373] text-[10px] tracking-[-0.2px]" style={{ fontFamily:'Helvetica Neue,sans-serif' }}>MY PROJECT</span>
        </div>
        <div className="mt-[14px]">
          <span className="text-[17px] font-bold text-white tracking-[-0.7px]" style={{ fontFamily:'Helvetica Neue,Noto Sans KR,sans-serif' }}>체력 기록 관리 시스템</span>
        </div>
        <div className="mt-[5px]">
          <span className="text-[#a6a6aa] text-[10px] tracking-[-0.1px]" style={{ fontFamily:'Helvetica Neue,Noto Sans KR,sans-serif', fontVariationSettings:'"wght" 400' }}>3일차 · 여러 기록 목록 관리하기</span>
        </div>
        <div className="mt-[22px]">
          <div className="flex items-center justify-between mb-[8px]">
            <span className="text-[9px] text-[#8a948d] tracking-[-0.288px]" style={{ fontFamily:'Helvetica Neue,Noto Sans KR,sans-serif', fontVariationSettings:'"wght" 400' }}>진행률</span>
            <span className="text-[11px] font-bold text-white tracking-[-0.5px]" style={{ fontFamily:'Helvetica Neue,sans-serif' }}>38%</span>
          </div>
          <div className="progress-track bg-white/10 h-[7px] rounded-full overflow-hidden">
            <div className="h-full bg-[#AAFF19] rounded-full shadow-[0_0_14px_rgba(170,255,25,0.34)]" style={{ width:'38%' }} />
          </div>
        </div>
        <div className="mt-4 bg-white/[0.04] rounded-[10px]">
          <div className="flex items-center justify-between px-[14px] py-[10px]">
            <div>
              <p className="text-[9px] text-[#8a948d] tracking-[-0.288px]" style={{ fontFamily:'Helvetica Neue,Noto Sans KR,sans-serif', fontVariationSettings:'"wght" 400' }}>현재 단계</p>
              <p className="text-[11px] font-semibold text-white tracking-[-0.25px] mt-[2px]" style={{ fontFamily:'Pretendard,sans-serif' }}>여러 기록 목록 관리하기</p>
            </div>
            <div className="bg-[rgba(170,255,25,0.08)] rounded-[6px] px-[8px] py-[4px]">
              <span className="text-[#aaff19] text-[11px] font-bold tracking-[-0.2px]" style={{ fontFamily:'Helvetica Neue,Noto Sans KR,sans-serif' }}>3일차</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        <button className="cursor-target w-full bg-[#aaff19] rounded-[11px] flex items-center justify-center h-[46px]"
          onClick={() => { navigate(2); }}>
          <span className="text-[13px] font-bold text-[#11170d]" style={{ fontFamily:'Pretendard,sans-serif' }}>이어서 학습하기 →</span>
        </button>
      </div>
    </div>
  );
}

// ─── Project data ─────────────────────────────────────────────────────────────
type Project = {
  id: number;
  title: string;
  desc: string;
  bg: string;
  duration: string;
  hours: string;
  period: string;
  level: string;
  tag: string;
  missions: string[];
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: '신규 프로젝트',
    desc: '프로젝트 안내 가이드로 실전 과제를 수행하며 AI 활용 역량을 키워보세요.',
    bg: 'linear-gradient(135deg,#00b09b,#10b981,#34d399)',
    duration: '1일 과정',
    hours: '1시간 이수',
    period: '상시 진행',
    level: '입문',
    tag: '기초',
    missions: ['프로젝트 환경 이해 및 설정', 'AI 도구 기본 실습', '간단한 결과물 생성', '팀원과 공유 및 피드백'],
  },
  {
    id: 2,
    title: '은행의 신용카드 사기 거래 탐지(Fraud Detection)',
    desc: '금융 데이터의 특성상 클래스 불균형(정상 거래가 사기 거래에 비해 압도적으로 많음)이 심하여 이 문제를 다양한 방법으로 해결합니다.',
    bg: 'linear-gradient(135deg,#2563eb,#3b82f6,#06b6d4)',
    duration: '8월 과정',
    hours: '8시간 이수',
    period: '2026.08.01 ~ 2026.08.31',
    level: '중급',
    tag: '데이터분석',
    missions: ['금융 데이터 탐색적 분석(EDA)', '클래스 불균형 처리 기법 비교', '머신러닝 모델 학습 및 평가', '결과 시각화 및 리포트 작성', '팀 발표 및 코드 리뷰'],
  },
  {
    id: 3,
    title: '자연어처리 기반 군 문서 자동 분류 시스템',
    desc: '대용량 행정 문서를 AI가 자동으로 분류하고 태깅하는 시스템을 구축하여 업무 효율성을 높입니다.',
    bg: 'linear-gradient(135deg,#7c3aed,#a855f7,#c026d3)',
    duration: '4주 과정',
    hours: '16시간 이수',
    period: '2026.09.01 ~ 2026.09.28',
    level: '고급',
    tag: 'NLP',
    missions: ['텍스트 전처리 파이프라인 구축', 'NLP 모델 선정 및 파인튜닝', '분류 정확도 평가 및 개선', '실제 문서 적용 테스트', '배포 및 운용 계획 수립'],
  },
  {
    id: 4,
    title: '드론 영상 기반 시설물 이상 탐지',
    desc: '드론이 촬영한 시설물 영상에서 컴퓨터 비전 기술로 균열, 부식 등의 이상 징후를 자동 감지합니다.',
    bg: 'linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)',
    duration: '3주 과정',
    hours: '12시간 이수',
    period: '2026.10.01 ~ 2026.10.21',
    level: '고급',
    tag: '컴퓨터비전',
    missions: ['드론 영상 수집 및 전처리', '객체 탐지 모델(YOLO) 적용', '이상 탐지 알고리즘 개발', '실시간 분석 파이프라인 구축', '정확도 평가 및 보고서 작성'],
  },
];

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onOpen }: { project: Project; onOpen?: (p: Project) => void }) {
  const visual = project.id === 1 ? '/project-purple.png' : project.id === 2 ? '/project-blue.png' : project.id === 3 ? '/project-green.png' : '/project-purple.png';
  return (
    <button
      className="page-card-reveal text-left flex flex-col md:flex-row rounded-[16px] overflow-hidden border border-white/[0.06] bg-[#19191b] hover:border-white/[0.16] transition-all duration-200 group"
      onClick={() => onOpen ? onOpen(project) : toast(project.title, { duration: 1500 })}>
      <div className="theme-gradient-surface relative w-full md:w-[58%] min-h-[220px] flex flex-col justify-between p-5 overflow-hidden" style={{ background: project.bg, backgroundImage: `url(${visual})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-white text-[11px] font-semibold flex items-center gap-1.5" style={{ fontFamily: 'Pretendard,sans-serif' }}><span className="size-4 rounded-full border border-white flex items-center justify-center">·</span>{project.id === 2 ? 'Advanced' : 'PBL'}</span>
          <span className="rounded-full bg-white text-[#222] text-[10px] font-semibold px-3 py-2" style={{ fontFamily: 'Pretendard,sans-serif' }}>♙ {project.id === 2 ? '1/4 모집중' : '4/4 모집 마감'}</span>
        </div>
        <h3 className="relative z-10 text-white font-bold text-[18px] leading-[1.35] max-w-[520px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{project.title}</h3>
        <div className="relative z-10 flex gap-2">
          {['Data','AI','HCP'].map(tag => <span key={tag} className="border border-white/80 text-white text-[12px] px-3 py-1 rounded-full" style={{ fontFamily: 'Pretendard,sans-serif' }}>{tag}</span>)}
        </div>
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between min-h-[220px]">
        <div>
          <h4 className="text-white font-bold text-[15px] leading-[1.4] mb-3" style={{ fontFamily:'Pretendard,sans-serif' }}>{project.title}</h4>
          <p className="text-[#737373] text-[12px] leading-[1.6] line-clamp-3" style={{ fontFamily:'Pretendard,sans-serif' }}>{project.desc}</p>
        </div>
        <div className="flex items-center gap-2 border-t border-white/[0.06] pt-3 mt-4">
          <span className="bg-[rgba(170,255,25,0.1)] text-[#aaff19] text-[10px] px-2 py-1 rounded" style={{ fontFamily:'Pretendard,sans-serif' }}>{project.duration}</span>
          <span className="bg-white/[0.06] text-[#a6a6aa] text-[10px] px-2 py-1 rounded" style={{ fontFamily:'Pretendard,sans-serif' }}>{project.hours}</span>
          <span className="ml-auto bg-white/[0.06] text-[#a6a6aa] text-[10px] px-2 py-1 rounded" style={{ fontFamily:'Pretendard,sans-serif' }}>{project.level}</span>
        </div>
      </div>
    </button>
  );
}

// ─── Project Content (listing) ────────────────────────────────────────────────
function ProjectContent({ compact, onOpenProject }: { compact?: boolean; onOpenProject?: (p: Project) => void }) {
  const [search, setSearch] = useState('');
  const filtered = PROJECTS.filter(p =>
    search === '' || p.title.toLowerCase().includes(search) || p.tag.toLowerCase().includes(search)
  );
  return (
    <div className={compact ? 'px-4 pt-6 pb-10' : 'px-8 pt-10 pb-10 max-w-[1200px] mx-auto'}>
      {/* Hero banner */}
      <div className={`theme-gradient-surface relative rounded-[20px] overflow-hidden mb-8 ${compact ? 'mb-5' : 'mb-10'}`}
        style={{ background: 'linear-gradient(135deg,#00453b,#006e5a,#008c6e)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #aaff19 0%, transparent 60%)' }} />
        <div className={`relative ${compact ? 'px-5 py-7 text-center' : 'px-12 py-10 text-center'}`}>
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <div className="size-2 rounded-full bg-[#aaff19]" />
            <span className="text-white/80 text-[12px] font-medium" style={{ fontFamily: 'Pretendard,sans-serif' }}>Project Based Learning</span>
          </div>
          <h1 className={`font-bold text-white mb-3 ${compact ? 'text-[22px]' : 'text-[32px]'}`}
            style={{ fontFamily: 'Pretendard,sans-serif', letterSpacing: '-1.2px' }}>
            PBL 프로젝트 학습
          </h1>
          <p className={`text-white/65 leading-[1.7] ${compact ? 'text-[13px]' : 'text-[15px] max-w-[520px] mx-auto'}`}
            style={{ fontFamily: 'Pretendard,sans-serif' }}>
            실제 필드에서 발생하는 보안 위협과 시나리오 기반의 문제를 직접 분석하여 설계·개발하여 해결하는 프로젝트 중심 실습 과정입니다.
          </p>
        </div>
      </div>

      {/* Count + Search row */}
      <div className={`flex items-center ${compact ? 'flex-col gap-3 mb-5' : 'justify-between mb-6'}`}>
        <p className={`text-[#a6a6aa] ${compact ? 'text-[13px] text-center' : 'text-[14px]'}`}
          style={{ fontFamily: 'Pretendard,sans-serif' }}>
          총 <span className="text-white font-semibold">{filtered.length}개</span>의 프로젝트 과정이 준비되어 있습니다.
        </p>
        <div className={`relative ${compact ? 'w-full' : 'w-[280px]'}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
          <input
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded-[12px] pl-9 pr-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:border-white/20 transition-colors"
            style={{ fontFamily: 'Pretendard,sans-serif', fontSize: 13 }}
            placeholder="프로젝트 명 또는 키워드 입력"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#555]" style={{ fontFamily: 'Pretendard,sans-serif', fontSize: 14 }}>검색 결과가 없습니다</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filtered.map(p => <ProjectCard key={p.id} project={p} onOpen={onOpenProject} />)}
        </div>
      )}
    </div>
  );
}

// ─── Project Detail Body ──────────────────────────────────────────────────────
function ProjectDetailBody({ project, onBack, mobile }: { project: Project; onBack: () => void; mobile?: boolean }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'missions'>('overview');
  const px = mobile ? 'px-4' : 'px-10';

  return (
    <div>
      {/* Hero */}
      <div className="theme-gradient-surface relative">
        <div className="absolute inset-0" style={{ background: project.bg }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className={`relative ${px} pt-6 pb-10`}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-5 text-[12px] text-white/45" style={{ fontFamily: 'Pretendard,sans-serif' }}>
            <button className="cursor-target hover:text-white/70 transition-colors" onClick={onBack}>홈</button>
            <span>/</span>
            <button className="cursor-target hover:text-white/70 transition-colors" onClick={onBack}>프로젝트</button>
            <span>/</span>
            <span className="text-white/70 line-clamp-1">{project.title}</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-4">
            <span className="text-white/70 text-[11px] font-semibold" style={{ fontFamily: 'Pretendard,sans-serif' }}>PBL PROJECT · {project.tag}</span>
          </div>
          <h1 className={`font-bold text-white leading-[1.3] mb-3 ${mobile ? 'text-[20px]' : 'text-[26px]'}`}
            style={{ fontFamily: 'Pretendard,sans-serif', letterSpacing: '-0.8px' }}>
            {project.title}
          </h1>
          <p className={`text-white/65 leading-[1.7] mb-5 ${mobile ? 'text-[13px]' : 'text-[14px] max-w-[600px]'}`}
            style={{ fontFamily: 'Pretendard,sans-serif' }}>
            {project.desc}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {[project.duration, project.hours, project.level, project.tag].map((t, i) => (
              <span key={i} className="bg-white/[0.12] text-white/80 text-[11px] px-3 py-[5px] rounded-full border border-white/10"
                style={{ fontFamily: 'Pretendard,sans-serif' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={mobile ? 'px-4 pt-5 pb-10 space-y-4' : 'max-w-[1100px] mx-auto px-10 py-8 flex gap-7 items-start'}>
        {/* Left / main */}
        <div className={mobile ? 'space-y-4' : 'flex-1 min-w-0 space-y-5'}>
          {/* Tabs */}
          <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-[12px] p-1">
            {(['overview', 'missions'] as const).map(tab => (
              <button key={tab}
                className={`cursor-target flex-1 py-2 rounded-[9px] text-[13px] font-semibold transition-all ${activeTab === tab ? 'bg-[rgba(170,255,25,0.1)] text-[#aaff19] border border-[rgba(170,255,25,0.2)]' : 'text-[#737373] hover:text-white'}`}
                style={{ fontFamily: 'Pretendard,sans-serif' }}
                onClick={() => setActiveTab(tab)}>
                {tab === 'overview' ? '프로젝트 개요' : '미션 목록'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <>
              {/* 프로젝트 소개 */}
              <section className="page-card-reveal rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] p-5">
                <h2 className="text-[15px] font-bold text-white mb-3" style={{ fontFamily: 'Pretendard,sans-serif' }}>프로젝트 소개</h2>
                <p className="text-[#a6a6aa] text-[13px] leading-[1.85]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{project.desc}</p>
                <p className="text-[#a6a6aa] text-[13px] leading-[1.85] mt-3" style={{ fontFamily: 'Pretendard,sans-serif' }}>
                  실무 환경에 가까운 시나리오를 통해 직접 문제를 분석하고 해결책을 도출하는 경험을 쌓을 수 있습니다. 완료 후에는 포트폴리오로 활용 가능한 결과물을 제출합니다.
                </p>
              </section>
              {/* 학습 목표 */}
              <section className="page-card-reveal rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] p-5">
                <h2 className="text-[15px] font-bold text-white mb-4" style={{ fontFamily: 'Pretendard,sans-serif' }}>학습 목표</h2>
                <div className="space-y-3">
                  {['실제 데이터로 문제를 정의하고 해결 방안을 기획하는 능력', `${project.tag} 관련 핵심 기술을 실습을 통해 깊이 있게 이해`, '팀 협업 과정에서 발생하는 이슈를 주도적으로 해결하는 경험', '최종 결과물을 문서화하고 발표하는 커뮤니케이션 역량'].map((goal, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="size-5 rounded-full shrink-0 bg-[rgba(170,255,25,0.1)] border border-[rgba(170,255,25,0.2)] flex items-center justify-center mt-0.5">
                        <span className="text-[#aaff19] text-[9px] font-bold">{i + 1}</span>
                      </div>
                      <p className="text-[#c0c0c0] text-[13px] leading-[1.5]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{goal}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'missions' && (
            <section className="page-card-reveal rounded-[16px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] p-5">
              <h2 className="text-[15px] font-bold text-white mb-1" style={{ fontFamily: 'Pretendard,sans-serif' }}>미션 목록</h2>
              <p className="text-[#555] text-[12px] mb-4" style={{ fontFamily: 'Pretendard,sans-serif' }}>{project.missions.length}개 미션</p>
              <div className="space-y-2.5">
                {project.missions.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-[11px] bg-white/[0.015] border border-white/[0.04] hover:border-white/[0.08] transition-colors group/mission">
                    <div className="size-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-[#aaff19] bg-[rgba(170,255,25,0.08)] border border-[rgba(170,255,25,0.15)]"
                      style={{ fontFamily: 'Orbitron,sans-serif' }}>{String(i + 1).padStart(2, '0')}</div>
                    <p className="text-[#c0c0c0] text-[13px] flex-1" style={{ fontFamily: 'Pretendard,sans-serif' }}>{m}</p>
                    <button className="cursor-target opacity-0 group-hover/mission:opacity-100 bg-[rgba(170,255,25,0.1)] hover:bg-[rgba(170,255,25,0.18)] text-[#aaff19] text-[11px] font-semibold px-3 py-[5px] rounded-[7px] transition-all shrink-0"
                      style={{ fontFamily: 'Pretendard,sans-serif' }}
                      onClick={() => toast('미션 시작', { description: m, duration: 1500 })}>
                      시작
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: info card (desktop only) */}
        {!mobile && (
          <div className="w-[280px] shrink-0 sticky top-6">
            <div className="page-card-reveal rounded-[20px] bg-[rgba(255,255,255,0.03)] border border-white/[0.08] overflow-hidden">
              <div className="theme-gradient-surface h-[120px] flex items-center justify-center" style={{ background: project.bg }}>
                <span className="text-white/20 font-black text-[48px]" style={{ fontFamily: 'Orbitron,sans-serif' }}>PBL</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  {[
                    { label: '진행 기간', value: project.period },
                    { label: '소요 시간', value: project.hours },
                    { label: '난이도', value: project.level },
                    { label: '분야', value: project.tag },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <span className="text-[#555] text-[12px] shrink-0" style={{ fontFamily: 'Pretendard,sans-serif' }}>{row.label}</span>
                      <span className="text-[#c0c0c0] text-[12px] text-right" style={{ fontFamily: 'Pretendard,sans-serif' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/[0.06] pt-4">
                  <button
                    className="cursor-target w-full bg-[#aaff19] hover:bg-[#c8ff50] active:scale-[0.98] transition-all rounded-[12px] h-[48px] font-bold text-[14px] text-[#0c0c0d]"
                    style={{ fontFamily: 'Pretendard,sans-serif' }}
                    onClick={() => toast('프로젝트 참가 신청', { description: project.title, duration: 2000 })}>
                    프로젝트 참가 신청
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile: CTA */}
        {mobile && (
          <button
            className="cursor-target w-full bg-[#aaff19] hover:bg-[#c8ff50] transition-colors rounded-[12px] h-[48px] font-bold text-[14px] text-[#0c0c0d]"
            style={{ fontFamily: 'Pretendard,sans-serif' }}
            onClick={() => toast('프로젝트 참가 신청', { description: project.title, duration: 2000 })}>
            프로젝트 참가 신청
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Desktop Project pages ────────────────────────────────────────────────────
function ProjectDesktopPage({ navigate, activeNav, openProject }: { navigate: NavigateFn; activeNav: number; openProject: (p: Project) => void }) {
  return (
    <div className="flex w-full h-full bg-[#0c0c0d]">
      <VodDesktopSidebar activeNav={activeNav} navigate={navigate} />
      <main className="flex-1 overflow-y-auto">
        <ProjectContent onOpenProject={openProject} />
      </main>
    </div>
  );
}

function ProjectDetailDesktopPage({ project, navigate, activeNav, goBack }: { project: Project; navigate: NavigateFn; activeNav: number; goBack: () => void }) {
  return (
    <div className="flex w-full h-full bg-[#0c0c0d]">
      <VodDesktopSidebar activeNav={activeNav} navigate={navigate} />
      <main className="flex-1 overflow-y-auto">
        <ProjectDetailBody project={project} onBack={goBack} />
      </main>
    </div>
  );
}

// ─── Mobile Project pages ─────────────────────────────────────────────────────
function MobileProjectView({ navigate, activeNav, openProject }: { navigate: NavigateFn; activeNav: number; openProject: (p: Project) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#0c0c0d]">
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav={activeNav} navigate={navigate} />
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} navigate={navigate} />
      <ProjectContent compact onOpenProject={openProject} />
    </div>
  );
}

function ProjectDetailMobileView({ project, navigate, activeNav, goBack }: { project: Project; navigate: NavigateFn; activeNav: number; goBack: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#0c0c0d]">
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav={activeNav} navigate={navigate} />
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} navigate={navigate} />
      <ProjectDetailBody project={project} onBack={goBack} mobile />
    </div>
  );
}

// ─── MyPage Content ───────────────────────────────────────────────────────────
function MyPageContent({ compact, navigate }: { compact?: boolean; navigate: NavigateFn }) {
  const px = compact ? 'px-4' : 'px-8';
  const maxW = compact ? '' : 'max-w-[960px] mx-auto';

  const statCards = [
    { value: '3',    label: '수강 중 VOD' },
    { value: '0',    label: '완료된 VOD' },
    { value: '1',    label: 'PBL 프로젝트' },
    { value: '0.0%', label: '평균 진도율' },
    { value: '0',    label: '수료증' },
    { value: '5',    label: '보유 크레딧' },
  ];

  const shortcuts = [
    { label: '내 학습',    icon: '📚', nav: 1 },
    { label: '보관함',     icon: '🗂️', nav: null },
    { label: '수료증 (0)', icon: '🏅', nav: null },
    { label: '크레딧',     icon: '💎', nav: null },
    { label: '팀 프로젝트',icon: '👥', nav: 2 },
    { label: '작성한 글 (0)', icon: '✍️', nav: null },
    { label: '알림',       icon: '🔔', nav: null },
    { label: '계정 설정',  icon: '⚙️', nav: null },
  ];

  const profileStats = [
    { color: '#FF8904', value: '21',  label: '연속 학습', sub: '최고 기록!' },
    { color: '#FDC700', value: '3',   label: '탐사 배지', sub: '총 10개 중' },
    { color: '#AAFF19', value: '4/10',label: '완료 미션', sub: '이번 프로젝트' },
    { color: '#51A2FF', value: '18h', label: '누적 학습', sub: '이번 달' },
  ];

  return (
    <div className={`${compact ? 'pt-5 pb-10' : 'pt-8 pb-12'} space-y-${compact ? '5' : '6'}`}>
      <div className={`${px} ${maxW}`}>

        {/* ── 프로필 카드 ── */}
        <div className="page-card-reveal rounded-[20px] border border-white/[0.06] overflow-hidden mb-6"
          style={{ background: 'linear-gradient(146deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 60%,rgba(170,255,25,0.02) 100%)' }}>
          <div className="p-5 md:p-6">
            {/* Profile row */}
            <div className="flex items-start gap-4 mb-5">
              <div className="size-[64px] md:size-[72px] rounded-full overflow-hidden bg-black/60 shrink-0 relative border-2 border-[rgba(170,255,25,0.25)]">
                <img src={imgProfile} alt="김철수 상병 프로필" className="absolute inset-0 size-full object-cover object-top" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-bold text-white tracking-[-1px] ${compact ? 'text-[20px]' : 'text-[24px]'}`}
                    style={{ fontFamily: 'Helvetica Neue,Noto Sans KR,sans-serif' }}>김철수 상병</span>
                  <span className="bg-[rgba(81,162,255,0.12)] border border-[rgba(81,162,255,0.2)] text-[#51a2ff] text-[11px] px-2.5 py-1 rounded-[8px]"
                    style={{ fontFamily: 'Pretendard,sans-serif' }}>AI 탐사대원</span>
                </div>
                <p className="mt-1 text-[#737373] text-[12px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>
                  상병 · 비전공 장병 · 체력 기록 관리 시스템 진행 중
                </p>
                {/* Level bar */}
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-[13px] font-black text-white shrink-0" style={{ fontFamily: 'Orbitron,sans-serif' }}>Lv. 23</span>
                  <div className="progress-track flex-1 bg-white/10 h-[6px] rounded-full overflow-hidden">
                    <div className="h-full bg-[#AAFF19] rounded-full shadow-[0_0_10px_rgba(170,255,25,0.4)]" style={{ width: '84%' }} />
                  </div>
                  <span className="text-[11px] font-bold text-white/70 shrink-0" style={{ fontFamily: 'Helvetica Neue,sans-serif' }}>84%</span>
                </div>
              </div>
            </div>
            {/* Activity stats grid */}
            <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {profileStats.map((s, i) => (
                <div key={i} className="rounded-[13px] p-3 flex gap-2.5 items-start border border-white/[0.06]"
                  style={{ background: 'linear-gradient(146deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 100%)' }}>
                  <div className="size-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: s.color }} />
                  <div>
                    <p className="text-[10px] font-semibold text-white/60" style={{ fontFamily: 'Pretendard,sans-serif' }}>{s.label}</p>
                    <p className="text-[18px] font-black text-white leading-[1.2]" style={{ fontFamily: 'Orbitron,sans-serif' }}>{s.value}</p>
                    <p className="text-[9px] text-[#555]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 온보딩 배너 ── */}
        <div className="page-card-reveal theme-gradient-surface rounded-[16px] overflow-hidden mb-6 relative"
          style={{ background: 'linear-gradient(135deg,#005c4b,#00875a)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 90% 50%,#aaff19 0%,transparent 55%)' }} />
          <div className="relative flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className={`font-bold text-white ${compact ? 'text-[14px]' : 'text-[15px]'}`}
                style={{ fontFamily: 'Pretendard,sans-serif' }}>🔔 온보딩 진단을 완료해주세요</p>
              <p className="text-white/65 text-[12px] mt-0.5" style={{ fontFamily: 'Pretendard,sans-serif' }}>역량 상황 진단 후 맞춤형 학습 로드맵을 추천해 드립니다.</p>
            </div>
            <button className="cursor-target shrink-0 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[12px] font-semibold px-4 py-2 rounded-[10px] transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Pretendard,sans-serif' }}
              onClick={() => toast('역량 진단', { description: '진단 페이지로 이동합니다', duration: 1500 })}>
              진단 시작하기 →
            </button>
          </div>
        </div>

        {/* ── 6개 통계 카드 ── */}
        <div className={`grid gap-3 mb-6 ${compact ? 'grid-cols-3' : 'grid-cols-6'}`}>
          {statCards.map((s, i) => (
            <div key={i} className="rounded-[14px] bg-[rgba(255,255,255,0.025)] border border-white/[0.06] p-4 text-center">
              <p className={`font-black text-white ${compact ? 'text-[18px]' : 'text-[22px]'}`}
                style={{ fontFamily: 'Orbitron,sans-serif' }}>{s.value}</p>
              <p className="text-[#737373] text-[11px] mt-1" style={{ fontFamily: 'Pretendard,sans-serif' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── 이어서 학습 + 역량 분석 ── */}
        <div className={`grid gap-4 mb-4 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {/* 이어서 학습하기 */}
          <div className="page-card-reveal rounded-[18px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Pretendard,sans-serif' }}>이어서 학습하기</h2>
              <button className="cursor-target text-[12px] text-[#aaff19] font-semibold hover:text-[#c8ff50] transition-colors"
                style={{ fontFamily: 'Pretendard,sans-serif' }}
                onClick={() => navigate(1)}>전체 보기 →</button>
            </div>
            {/* In-progress item */}
            <div className="rounded-[13px] bg-white/[0.03] border border-white/[0.05] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[rgba(170,255,25,0.1)] text-[#aaff19] text-[10px] font-bold px-2 py-0.5 rounded-[5px]"
                  style={{ fontFamily: 'Pretendard,sans-serif' }}>진행 중</span>
                <span className="text-[#555] text-[10px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>MY PROJECT</span>
              </div>
              <p className="text-white font-semibold text-[14px] mb-1" style={{ fontFamily: 'Pretendard,sans-serif' }}>체력 기록 관리 시스템</p>
              <p className="text-[#737373] text-[11px] mb-3" style={{ fontFamily: 'Pretendard,sans-serif' }}>3일차 · 여러 기록 목록 관리하기</p>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#737373] text-[10px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>진행률</span>
                <span className="text-white text-[11px] font-bold" style={{ fontFamily: 'Helvetica Neue,sans-serif' }}>38%</span>
              </div>
              <div className="progress-track bg-white/10 h-[6px] rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[#AAFF19] rounded-full shadow-[0_0_8px_rgba(170,255,25,0.35)]" style={{ width: '38%' }} />
              </div>
              <button className="cursor-target w-full bg-[rgba(170,255,25,0.1)] hover:bg-[rgba(170,255,25,0.18)] border border-[rgba(170,255,25,0.2)] text-[#aaff19] text-[12px] font-bold py-2 rounded-[9px] transition-colors"
                style={{ fontFamily: 'Pretendard,sans-serif' }}
                onClick={() => navigate(2)}>이어서 학습하기 →</button>
            </div>
          </div>

          {/* 나의 역량 분석 */}
          <div className="page-card-reveal rounded-[18px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Pretendard,sans-serif' }}>나의 역량 분석</h2>
              <button className="cursor-target text-[12px] text-[#aaff19] font-semibold hover:text-[#c8ff50] transition-colors"
                style={{ fontFamily: 'Pretendard,sans-serif' }}
                onClick={() => navigate(4)}>진단하기 →</button>
            </div>
            {/* Radar placeholder */}
            <div className="flex flex-col items-center justify-center py-6 text-center gap-3">
              <div className="size-16 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <svg viewBox="0 0 32 32" fill="none" width={28} height={28}>
                  <polygon points="16,3 29,11 29,21 16,29 3,21 3,11" stroke="rgba(170,255,25,0.3)" strokeWidth="1.5" fill="rgba(170,255,25,0.04)" />
                  <polygon points="16,8 24,12.5 24,19.5 16,24 8,19.5 8,12.5" stroke="rgba(170,255,25,0.15)" strokeWidth="1" fill="none" />
                </svg>
              </div>
              <div>
                <p className="text-[#737373] text-[13px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>진단평가를 실시하면 역량 지표가 표시됩니다.</p>
                <button className="cursor-target mt-2 text-[#aaff19] text-[12px] font-semibold hover:text-[#c8ff50] transition-colors"
                  style={{ fontFamily: 'Pretendard,sans-serif' }}
                  onClick={() => navigate(4)}>진단평가 실시하기 →</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 추천 학습 + 바로가기 ── */}
        <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {/* 추천 학습 */}
          <div className="rounded-[18px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] p-5">
            <h2 className="text-[15px] font-bold text-white mb-4" style={{ fontFamily: 'Pretendard,sans-serif' }}>추천 학습</h2>
            <div className="space-y-3">
              {COURSES.slice(0, 3).map(c => (
                <button key={c.id}
                  className="cursor-target w-full flex items-center gap-3 p-3 rounded-[12px] bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all text-left"
                  onClick={() => toast(c.title, { description: '강의로 이동합니다', duration: 1400 })}>
                  <div className="size-10 rounded-[8px] shrink-0 flex items-center justify-center" style={{ background: c.bg }}>
                    <span className="text-white font-black text-[10px]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{c.topic.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[12px] font-semibold line-clamp-1" style={{ fontFamily: 'Pretendard,sans-serif' }}>{c.title}</p>
                    <p className="text-[#555] text-[11px] mt-0.5" style={{ fontFamily: 'Pretendard,sans-serif' }}>{c.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 바로가기 */}
          <div className="rounded-[18px] bg-[rgba(255,255,255,0.02)] border border-white/[0.06] p-5">
            <h2 className="text-[15px] font-bold text-white mb-4" style={{ fontFamily: 'Pretendard,sans-serif' }}>바로가기</h2>
            <div className="grid grid-cols-4 gap-2">
              {shortcuts.map((s, i) => (
                <button key={i}
                  className="cursor-target flex flex-col items-center gap-1.5 p-3 rounded-[12px] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all"
                  onClick={() => s.nav !== null ? navigate(s.nav) : toast(s.label, { duration: 1200 })}>
                  <span className="text-[18px] leading-none">{s.icon}</span>
                  <span className="text-[10px] text-[#a6a6aa] text-center leading-[1.3]" style={{ fontFamily: 'Pretendard,sans-serif' }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Desktop MyPage ────────────────────────────────────────────────────────────
function MyPageDesktopPage({ navigate, activeNav }: { navigate: NavigateFn; activeNav: number }) {
  return (
    <div className="flex w-full h-full bg-[#0c0c0d]">
      <VodDesktopSidebar activeNav={activeNav} navigate={navigate} />
      <main className="flex-1 overflow-y-auto">
        <MyPageContent navigate={navigate} />
      </main>
    </div>
  );
}

// ─── Mobile MyPage ─────────────────────────────────────────────────────────────
function MyPageMobileView({ navigate, activeNav }: { navigate: NavigateFn; activeNav: number }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#0c0c0d]">
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav={activeNav} navigate={navigate} />
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} navigate={navigate} />
      <MyPageContent compact navigate={navigate} />
    </div>
  );
}

// ─── Mobile home layout ───────────────────────────────────────────────────────
function MobileHomeView({ navigate, activeNav }: { navigate: NavigateFn; activeNav: number }) {
  const { mode } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-[#0c0c0d]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <PixelBlast variant="square" pixelSize={4} color="#AAFF19" patternScale={2} patternDensity={1}
          enableRipples rippleSpeed={0.3} rippleThickness={0.1} rippleIntensityScale={1}
          speed={0.5} transparent edgeFade={0} />
      </div>
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeNav={activeNav} navigate={navigate} />
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} navigate={navigate} onLogoClick={() => window.location.reload()} />
      <main className="relative px-4 pt-10 pb-10 space-y-4">
        <div className="mb-8">
          <h1 className="text-[26px] font-bold text-white tracking-[-2px] leading-[1.2]" style={{ fontFamily:'Pretendard,sans-serif' }}>
            김철수 상병님,<br />탐사를 이어가 보세요.
          </h1>
          <p className="mt-2 text-[#a6a6aa] text-[15px] font-semibold tracking-[-0.18px]" style={{ fontFamily:'Pretendard,sans-serif' }}>
            현재 학습 단계와 새롭게 도전할 프로젝트를 확인해 보세요.
          </p>
        </div>
        <MobileArticleCard />
        <MobileRecentProjectCard navigate={navigate} />
      </main>
    </div>
  );
}

// ─── Desktop home ─────────────────────────────────────────────────────────────
// The exported Figma home contained its own 230px sidebar. Desktop pages now
// share the same 271px React sidebar, while only the original home content area
// is fitted to the remaining viewport.
function DesktopHomeView({ navigate }: { navigate: NavigateFn }) {
  const { mode, toggle } = useContext(ThemeContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const parallaxFrameRef = useRef(0);
  const [contentFit, setContentFit] = useState({ scale: 1, left: 0, top: 0 });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const update = () => {
      const rect = viewport.getBoundingClientRect();
      const scale = Math.min(
        rect.width / HOME_CONTENT_WIDTH,
        rect.height / HOME_DESIGN_HEIGHT,
      );
      setContentFit({
        scale,
        left: (rect.width - (HOME_CONTENT_WIDTH * scale)) / 2,
        top: (rect.height - (HOME_DESIGN_HEIGHT * scale)) / 2,
      });
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const cleanups: (() => void)[] = [];
    const exportedBackground = root.querySelector<HTMLElement>('[data-name="image 2542"]');
    if (exportedBackground) {
      exportedBackground.style.opacity = '0';
      cleanups.push(() => { exportedBackground.style.opacity = ''; });
    }
    const addClick = (el: Element, handler: () => void) => {
      el.addEventListener('click', handler);
      cleanups.push(() => el.removeEventListener('click', handler));
    };
    const markTarget = (el: HTMLElement) => { el.classList.add('cursor-target'); el.style.cursor = 'pointer'; };

    const navFrames = root.querySelectorAll<HTMLElement>('[class*="gap-[5.125px]"][class*="top-[106px]"]');
    const applyNavActive = (idx: number) => {
      navFrames.forEach(frame => {
        (Array.from(frame.children) as HTMLElement[]).forEach((btn, i) => {
          if (i === idx) {
            btn.style.backgroundColor = 'rgba(180,255,57,0.1)';
            btn.style.outline = '1px solid rgba(180,255,57,0.2)';
            btn.querySelectorAll<SVGPathElement>('path[stroke]').forEach(p => p.setAttribute('stroke', '#B4FF39'));
            btn.querySelectorAll<HTMLElement>('p').forEach(p => { p.style.color = '#B4FF39'; p.style.fontWeight = '600'; });
          } else {
            // '' 대신 'transparent'/'none' — CSS 클래스 기반 스타일을 inline으로 덮어써야 함
            btn.style.backgroundColor = 'transparent';
            btn.style.outline = 'none';
            btn.querySelectorAll<SVGPathElement>('path[stroke]').forEach(p => p.setAttribute('stroke', 'white'));
            btn.querySelectorAll<HTMLElement>('p').forEach(p => { p.style.color = 'white'; p.style.fontWeight = ''; });
          }
        });
      });
    };
    navFrames.forEach(frame => {
      (Array.from(frame.children) as HTMLElement[]).forEach((btn, i) => {
        markTarget(btn);
        btn.style.borderRadius = '14.35px';
        // 홈 버튼(i===0)의 피그마 빌드인 active 요소 제거 — border overlay div, 코너 브래킷 SVG
        const ariaHiddenBorder = btn.querySelector<HTMLElement>('[aria-hidden]');
        if (ariaHiddenBorder) ariaHiddenBorder.style.display = 'none';
        btn.querySelectorAll<HTMLElement>('div.absolute.flex.items-center.justify-center').forEach(el => {
          el.style.display = 'none';
        });
        addClick(btn, () => {
          applyNavActive(i);
          navigate(i);
          toast(NAV_ITEMS[i], { description: `${NAV_ITEMS[i]} 페이지로 이동합니다`, duration: 1500 });
        });
      });
    });
    applyNavActive(0);

    const headerLabels = ['알림', '설정', '프로필'];
    root.querySelectorAll<HTMLElement>('[data-name="Header"] [data-name="Button"]').forEach((btn, i) => {
      markTarget(btn);
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', i === 1 ? (mode === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환') : (headerLabels[i] ?? '버튼'));
      addClick(btn, () => {
        if (i === 1) {
          toggle();
          return;
        }
        toast(headerLabels[i] ?? '버튼', { duration: 1200 });
      });
    });
    root.querySelectorAll<HTMLElement>('[class*="bg-[#a1a1a1]"]').forEach(btn => {
      markTarget(btn); addClick(btn, () => toast('AI 교관', { description: 'AI 교관과 질문 세션을 시작합니다', duration: 2000 }));
    });
    root.querySelectorAll<HTMLElement>('[class*="bg-[#aaff19]"][class*="rounded-[11px]"]').forEach(btn => {
      markTarget(btn); addClick(btn, () => toast('학습 재개', { description: '체력 기록 관리 시스템 이어서 학습합니다', duration: 2000 }));
    });
    const statLabels = ['연속 학습', '탐사 배지', '완료 미션', '누적 학습'];
    root.querySelectorAll<HTMLElement>('[class*="flex-[1_0_0]"][class*="rounded-[14px]"]').forEach((card, i) => {
      markTarget(card);
      card.classList.add('home-reveal-card');
      card.style.animationDelay = `${180 + (i * 90)}ms`;
      addClick(card, () => toast(statLabels[i % statLabels.length], { duration: 1200 }));
    });
    const stageOrder = new Map([
      ['1단계', 0],
      ['2단계', 1],
      ['3단계', 2],
      ['4단계', 3],
      ['최종', 4],
    ]);
    root.querySelectorAll<HTMLElement>('[class*="gap-[12.149px]"]').forEach(node => {
      const stageName = Array.from(node.querySelectorAll('p'))
        .map(label => label.textContent?.trim())
        .find(label => label && stageOrder.has(label));
      if (!stageName) return;
      node.classList.remove('cursor-target');
      node.classList.add('home-stage-reveal');
      node.style.animationDelay = `${160 + ((stageOrder.get(stageName) ?? 0) * 180)}ms`;
      node.style.pointerEvents = 'none';
      node.setAttribute('aria-disabled', 'true');
      node.style.height = 'auto';
      node.style.width = 'max-content';
      node.style.minWidth = 'max-content';
      node.style.overflow = 'visible';
      node.querySelectorAll<HTMLElement>('p').forEach(label => {
        label.style.lineHeight = '1.35';
        label.style.paddingBottom = '4px';
        label.style.overflow = 'visible';
        label.style.whiteSpace = 'nowrap';
      });
    });
    root.querySelectorAll<HTMLElement>('[class*="from-[#79dffd]"]').forEach(el => {
      el.style.lineHeight = '1.3';
      el.style.paddingBottom = '3px';
    });
    const featurePanels = [
      root.querySelector<HTMLElement>('[data-name="Article"]'),
      root.querySelector<HTMLElement>('[class*="h-[386.398px]"][class*="w-[451.195px]"]'),
    ].filter((panel): panel is HTMLElement => Boolean(panel));
    featurePanels.forEach((panel, i) => {
      panel.classList.add('home-reveal-panel');
      panel.style.animationDelay = `${360 + (i * 150)}ms`;
    });

    const progressFills = Array.from(root.querySelectorAll<HTMLElement>('[data-name="Italic Text"]'));
    root.querySelectorAll<HTMLElement>('[data-name="Container"]').forEach(el => {
      if (el.className.includes('bg-[#aaff19]') && el.className.includes('h-[7px]')) {
        progressFills.push(el);
      }
    });
    progressFills.forEach((fill, i) => {
      fill.classList.add('home-progress-fill');
      fill.parentElement?.classList.add('progress-track');
      fill.style.animationDelay = `${760 + (i * 180)}ms`;
    });

    Array.from(root.querySelectorAll<HTMLElement>('p'))
      .filter(el => ['최근 프로젝트', '김철수 상병'].includes(el.textContent?.trim() ?? ''))
      .forEach((label, i) => {
        const card = label.parentElement?.parentElement;
        if (card) {
          card.classList.add('home-reveal-card');
          card.style.animationDelay = `${80 + (i * 120)}ms`;
        }
      });
    return () => cleanups.forEach(fn => fn());
  }, [mode, navigate, toggle]);

  const moveBackground = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const viewport = viewportRef.current;
    const background = backgroundRef.current;
    if (!viewport || !background) return;
    const rect = viewport.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * -18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
    cancelAnimationFrame(parallaxFrameRef.current);
    parallaxFrameRef.current = requestAnimationFrame(() => {
      background.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.04)`;
    });
  }, []);

  const resetBackground = useCallback(() => {
    const background = backgroundRef.current;
    if (background) background.style.transform = 'translate3d(0, 0, 0) scale(1.04)';
  }, []);

  return (
    <div className="flex size-full bg-[#0c0c0d]">
      <VodDesktopSidebar activeNav={0} navigate={navigate} onLogoClick={() => window.location.reload()} />
      <main ref={viewportRef} onPointerMove={moveBackground} onPointerLeave={resetBackground} className="relative flex-1 h-full min-w-0 overflow-hidden bg-[#0c0c0d]" data-theme-surface="home">
        <div ref={backgroundRef} className="absolute -inset-[3%] pointer-events-none transition-transform duration-700 ease-out will-change-transform" style={{ transform: 'translate3d(0, 0, 0) scale(1.04)' }}>
          <PixelBlast variant="square" pixelSize={4} color="#AAFF19" patternScale={2} patternDensity={1}
            enableRipples rippleSpeed={0.3} rippleThickness={0.1} rippleIntensityScale={1}
            speed={0.5} transparent edgeFade={0} />
        </div>
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${mode === 'light' ? 'bg-white/10' : 'bg-black/25'}`} />
        <div
          className="absolute overflow-hidden"
          style={{
            width: HOME_CONTENT_WIDTH,
            height: HOME_DESIGN_HEIGHT,
            left: contentFit.left,
            top: contentFit.top,
            transform: `scale(${contentFit.scale})`,
            transformOrigin: 'left top',
          }}
        >
          <div
            ref={containerRef}
            style={{
              width: HOME_DESIGN_WIDTH,
              height: HOME_DESIGN_HEIGHT,
              transform: `translateX(-${HOME_SOURCE_SIDEBAR_WIDTH}px)`,
            }}
          >
            <B />
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() =>
    window.localStorage.getItem('mili-theme') === 'light' ? 'light' : 'dark'
  );
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeNav, setActiveNav] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeLesson, setActiveLesson] = useState(0);

  const applyHistoryRoute = useCallback((route: { page?: Page; nav?: number; courseId?: number; projectId?: number; lesson?: number }) => {
    const page = route.page ?? 'home';
    setCurrentPage(page);
    setActiveNav(route.nav ?? (page === 'vod' || page === 'course' || page === 'classroom' ? 1 : page === 'project' || page === 'projectDetail' ? 2 : page === 'mypage' ? 6 : 0));
    setSelectedCourse(route.courseId ? COURSES.find(c => c.id === route.courseId) ?? null : null);
    setSelectedProject(route.projectId ? PROJECTS.find(p => p.id === route.projectId) ?? null : null);
    setActiveLesson(route.lesson ?? 0);
  }, []);

  useEffect(() => {
    const initial = window.history.state?.miliRoute ?? { page: 'home', nav: 0 };
    applyHistoryRoute(initial);
    const onPopState = (event: PopStateEvent) => applyHistoryRoute(event.state?.miliRoute ?? { page: 'home', nav: 0 });
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [applyHistoryRoute]);

  const pushRoute = useCallback((route: { page: Page; nav?: number; courseId?: number; projectId?: number; lesson?: number }) => {
    window.dispatchEvent(new Event('mili:cursor-reset'));
    window.history.pushState({ miliRoute: route }, '', window.location.href);
    applyHistoryRoute(route);
  }, [applyHistoryRoute]);

  const navigate = useCallback((navIndex: number) => {
    pushRoute({ page: navIndex === 1 ? 'vod' : navIndex === 2 ? 'project' : navIndex === 6 ? 'mypage' : 'home', nav: navIndex });
  }, [pushRoute]);

  const openCourse = useCallback((course: Course) => {
    pushRoute({ page: 'course', nav: 1, courseId: course.id });
  }, [pushRoute]);

  const goBack = useCallback(() => {
    pushRoute({ page: 'vod', nav: 1 });
  }, [pushRoute]);

  const startLesson = useCallback((moduleIndex: number) => {
    pushRoute({ page: 'classroom', nav: 1, courseId: selectedCourse?.id, lesson: moduleIndex });
  }, [pushRoute, selectedCourse]);

  const closeClassroom = useCallback(() => {
    pushRoute({ page: 'course', nav: 1, courseId: selectedCourse?.id });
  }, [pushRoute, selectedCourse]);

  const openProject = useCallback((project: Project) => {
    pushRoute({ page: 'projectDetail', nav: 2, projectId: project.id });
  }, [pushRoute]);

  const goBackToProjects = useCallback(() => {
    pushRoute({ page: 'project', nav: 2 });
  }, [pushRoute]);

  const toggleTheme = useCallback(() => {
    setThemeMode(mode => mode === 'dark' ? 'light' : 'dark');
  }, []);

  useEffect(() => {
    const isLight = themeMode === 'light';
    document.documentElement.classList.toggle('light-mode', isLight);
    document.documentElement.classList.toggle('dark', !isLight);
    document.documentElement.dataset.theme = themeMode;
    window.localStorage.setItem('mili-theme', themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ mode: themeMode, toggle: toggleTheme }}>
      <TargetCursor spinDuration={5} hideDefaultCursor parallaxOn hoverDuration={0.3}
        resetKey={currentPage} cursorColor={themeMode === 'light' ? '#15191d' : '#ffffff'} cursorColorOnTarget="#8edb00" targetSelector=".cursor-target" />
      <Toaster position="bottom-right" theme={themeMode} toastOptions={{
        style: themeMode === 'light'
          ? { background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', color: '#17191d' }
          : { background: '#1a1d21', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' },
      }} />

      {/* Desktop (xl+): the home canvas is authored at exactly 1920 × 1080. */}
      <div className="relative hidden xl:flex w-screen h-[100dvh] max-w-full overflow-hidden bg-[#0c0c0d] items-center justify-center">
        <PageFade page={currentPage}>
          {currentPage === 'home'          && <DesktopHomeView navigate={navigate} />}
          {currentPage === 'vod'           && <VodDesktopPage navigate={navigate} activeNav={activeNav} openCourse={openCourse} />}
          {currentPage === 'course'        && selectedCourse  && <CourseDetailDesktopPage course={selectedCourse} navigate={navigate} activeNav={activeNav} goBack={goBack} onStartLesson={startLesson} />}
          {currentPage === 'classroom'     && selectedCourse  && <ClassroomDesktop course={selectedCourse} moduleIndex={activeLesson} onSelect={setActiveLesson} onClose={closeClassroom} navigate={navigate} />}
          {currentPage === 'project'       && <ProjectDesktopPage navigate={navigate} activeNav={activeNav} openProject={openProject} />}
          {currentPage === 'projectDetail' && selectedProject && <ProjectDetailDesktopPage project={selectedProject} navigate={navigate} activeNav={activeNav} goBack={goBackToProjects} />}
          {currentPage === 'mypage'        && <MyPageDesktopPage navigate={navigate} activeNav={activeNav} />}
        </PageFade>
        {currentPage !== 'home' && currentPage !== 'classroom' && <ThemeToggle floating />}
      </div>

      {/* Fluid tablet/mobile layout (<1280px). */}
      <div className="xl:hidden min-h-[100dvh] w-full max-w-full overflow-x-clip bg-[#0c0c0d]">
        <PageFade page={currentPage} mobile>
          {currentPage === 'home'          && <MobileHomeView navigate={navigate} activeNav={activeNav} />}
          {currentPage === 'vod'           && <MobileVodView  navigate={navigate} activeNav={activeNav} openCourse={openCourse} />}
          {currentPage === 'course'        && selectedCourse  && <CourseDetailMobileView course={selectedCourse} navigate={navigate} activeNav={activeNav} goBack={goBack} onStartLesson={startLesson} />}
          {currentPage === 'classroom'     && selectedCourse  && <ClassroomMobile course={selectedCourse} moduleIndex={activeLesson} onSelect={setActiveLesson} onClose={closeClassroom} navigate={navigate} />}
          {currentPage === 'project'       && <MobileProjectView navigate={navigate} activeNav={activeNav} openProject={openProject} />}
          {currentPage === 'projectDetail' && selectedProject && <ProjectDetailMobileView project={selectedProject} navigate={navigate} activeNav={activeNav} goBack={goBackToProjects} />}
          {currentPage === 'mypage'        && <MyPageMobileView navigate={navigate} activeNav={activeNav} />}
        </PageFade>
      </div>
    </ThemeContext.Provider>
  );
}
