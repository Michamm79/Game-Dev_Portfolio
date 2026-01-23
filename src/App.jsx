import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Eye,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Code,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function GameDevPortfolio() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const heroRef = useRef(null);

  // Code snippets - replace with your actual code
  const codeExamples = [
    {
      id: 1,
      title: 'Boss Cinematic System - Project Maelstrom',
      category: 'Cinematics / Game Aesthetic',
      language: 'csharp',
      description:
        'Dynamic boss encounter cinematics with entrance sequence and finisher camera. Features camera following, VFX coordination, animation triggering, and player control management.',
      code: `public class BossCinematicTrigger : MonoBehaviour
{
  [Header("Entrance Cinematic Camera")]
  [SerializeField] private Camera mainCamera;
  [SerializeField] private float cinematicDuration = 5f;
  [SerializeField] private Vector3 entranceCameraOffset = new Vector3(0, 5, -10);
  [SerializeField] private bool entranceCameraFollowsBoss = true;

  [Header("Finisher Cinematic Camera")]
  [SerializeField] private Vector3 finisherCameraOffset = new Vector3(0, 3, -8);
  [SerializeField] private GameObject specialAttackVFX;

  public IEnumerator BossEntranceCinematic()
  {
      PlayerController player = PlayerController.Instance;
      player.enabled = false;

      Vector3 originalCamPos = mainCamera.transform.position;

      bossObject.SetActive(true);
      bossObject.transform.position = bossSpawnPoint.position;

      EnemyAI bossAI = bossObject.GetComponent<EnemyAI>();
      if (bossAI != null) bossAI.enabled = false;

      Vector3 camPos = bossObject.transform.position + entranceCameraOffset;
      mainCamera.transform.position = camPos;
      mainCamera.transform.LookAt(bossObject.transform.position + Vector3.up * 2f);

      float elapsed = 0;
      Vector3 startPos = bossObject.transform.position;

      while (elapsed < cinematicDuration)
      {
          elapsed += Time.deltaTime;
          float t = elapsed / cinematicDuration;

          bossObject.transform.position = Vector3.Lerp(startPos, townCenter.position, t);

          if (entranceCameraFollowsBoss)
          {
              mainCamera.transform.position =
                  bossObject.transform.position + entranceCameraOffset;
              mainCamera.transform.LookAt(bossObject.transform.position + Vector3.up * 2f);
          }

          yield return null;
      }

      mainCamera.transform.position = originalCamPos;
      bossAI.enabled = true;
      player.enabled = true;
  }
}`,
      github: 'https://github.com/yourusername/vr-fire-training',
    },
    {
      id: 2,
      title: 'Weapon Evolution System - Project Maelstrom',
      category: 'Game Systems / Narrative',
      language: 'csharp',
      description:
        'Weapon evolution sequence triggered on player "death". Freezes time, plays essence animation, offers choice, then revives with new powers.',
      code: `public class EvolutionSequenceManager : MonoBehaviour
{
    public static EvolutionSequenceManager Instance { get; private set; }

    [Header("References")]
    [SerializeField] private GameObject weaponEvolutionPanel;
    [SerializeField] public BossHealth bossHealth;

    [Header("Animation Settings")]
    [SerializeField] private float bloodEssenceDuration = 3f;
    [SerializeField] private string evolutionMessage = "Choose your path...";

    private bool evolutionTriggered = false;

    void Start()
    {
        if (PlayerHealth.Instance != null)
        {
            PlayerHealth.Instance.OnPlayerDeath += OnPlayerDeath;
        }
    }

    private void OnPlayerDeath()
    {
        if (evolutionTriggered) return;
        if (bossHealth != null && !bossHealth.isInvincible) return;

        evolutionTriggered = true;
        StartCoroutine(EvolutionSequence());
    }

    private IEnumerator EvolutionSequence()
    {
        Time.timeScale = 0f;
        yield return new WaitForSecondsRealtime(1f);

        PlayBloodEssenceAnimation();
        yield return new WaitForSecondsRealtime(bloodEssenceDuration);

        PlayerHealth.Instance?.RevivePlayer();
        SubtitleUI.Instance?.ShowSubtitle(evolutionMessage, 3f);

        yield return new WaitForSecondsRealtime(1f);
        weaponEvolutionPanel?.SetActive(true);
    }

    private void PlayBloodEssenceAnimation()
    {
        var anim = PlayerHealth.Instance?.GetComponent<Animator>();
        if (anim != null)
        {
            anim.updateMode = AnimatorUpdateMode.UnscaledTime;
            anim.SetTrigger("TriggerEvolution");
        }
    }
}`,
      github: 'https://github.com/yourusername/vr-fire-training',
    },
    {
      id: 3,
      title: 'Pack Behavior AI - Project Maelstrom',
      category: 'Game AI / Systems',
      language: 'csharp',
      description:
        'Coordinated enemy AI preventing dog-piling: enemies take turns attacking while others circle.',
      code: `public class PackBehaviorAI : MonoBehaviour
{
  [SerializeField] private int maxSimultaneousAttackers = 2;
  [SerializeField] private float attackCoordinationDelay = 1.5f;
  [SerializeField] private float circleDistance = 4f;

  private static float lastPackAttackTime = 0f;

  private bool CanAttackNow(int currentAttackers)
  {
      if (currentAttackers >= maxSimultaneousAttackers) return false;
      if (Time.time < lastPackAttackTime + attackCoordinationDelay) return false;
      return true;
  }

  public void OnAttackExecuted()
  {
      lastPackAttackTime = Time.time;
  }
}`,
    },
    {
      id: 4,
      title: 'Photon Networking - State Synchronization',
      category: 'Networking',
      language: 'csharp',
      description:
        'Custom RPC system for syncing state across multiplayer clients.',
      code: `public class FireStateSync : MonoBehaviourPunCallbacks
{
  [PunRPC]
  private void SyncFireState(int fireID, bool isActive, float intensity)
  {
      if (!PhotonNetwork.IsMasterClient)
      {
          FireManager.Instance.UpdateFireState(fireID, isActive, intensity);
      }
  }
}`,
    },
  ];

  // Sample projects data
  const projects = [
    {
      id: 1,
      title: 'Project Maelstrom - Solo Dev Game Demo',
      category: 'Action-Adventure RPG',
      thumbnail: 'https://i.ibb.co/S4MBjHTs/PM-Environment.jpg',
      video: 'your-video-url.mp4', // replace
      description:
        'Inclusive Action-RPG where players unknowingly exist in a hyper-realistic virtual experiment. Multiplayer coming.',
      tags: ['Game Development', 'Action-RPG', 'ML.NET', 'C# - C++'],
    },
    {
      id: 2,
      title: 'B52 Training Suite (Military Contract)',
      category: 'VR/Military - AAA-Scale Production',
      thumbnail:
        'https://i.ibb.co/N6tTKxwN/B52-Training-Immersive-Environment.jpg',
      video: 'YOUR-YOUTUBE-LINK-HERE', // replace
      description:
        'Multi-million dollar immersive B52 training system. Multiple trainees linked using Normcore (migrated to Photon).',
      tags: [
        'Unity',
        'VR',
        'Photon PUN',
        'Normcore',
        'AAA-Scale',
        'Multiplayer',
      ],
    },
    {
      id: 3,
      title: 'Sensorama R&D Project',
      category: 'VR/AR & Robotics',
      thumbnail: 'https://i.ibb.co/F4LbcVry/UI-Example.jpg',
      description:
        'Holographic content placement system using OVR and Photon networking.',
      tags: ['Unity', 'MR', 'Spatial Computing'],
    },
  ];

  const images = [
    'https://i.ibb.co/S4MBjHTs/PM-Environment.jpg',
    'https://i.ibb.co/N6tTKxwN/B52-Training-Immersive-Environment.jpg',
    'https://i.ibb.co/bMmJF98N/PM-Enemies-Combat-Zone-Attack-Range.jpg',
    'https://i.ibb.co/32V89zD/FS-Remake.jpg',
    'https://i.ibb.co/F4LbcVry/UI-Example.jpg',
    'https://i.ibb.co/qLmjf6rG/FS-Remake2.jpg',
  ];

  const unityBuild = {
    title: 'Project Maelstrom - Current Demo',
    downloadUrl:
      'https://drive.google.com/uc?export=download&id=1UN2JscSoITkEnWKtlrVL6CnSK9TLkf6M',
    description:
      'Demo build available for download. Begin your adventure in a new world, survive the Maelstrom.',
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'code', 'media', 'unity'];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // -------------------------
  // EMBERS (stable “energy” effect)
  // -------------------------
  const embers = useMemo(() => {
    const count = 90;
    return Array.from({ length: count }, (_, i) => {
      const dur = 4 + Math.random() * 6.5; // 4–10.5s
      const size = 2 + Math.random() * 7; // 2–9px
      const startY = 70 + Math.random() * 40; // start near bottom
      const glow = 8 + Math.random() * 18;
      const isWhite = Math.random() < 0.25;

      return {
        id: i,
        left: Math.random() * 100,
        top: startY,
        size,
        delay: -(Math.random() * dur),
        duration: dur,
        dx: -60 + Math.random() * 120,
        alpha: 0.45 + Math.random() * 0.45,
        color: isWhite ? 'rgba(255,255,255,0.95)' : 'rgba(255,0,0,0.95)',
        glow,
      };
    });
  }, []);

  return (
    <div className="portfolio">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --void-black: #050508;
          --deep-shadow: #0b0b12;
          --midnight-blue: #111118;
          --electric-cyan: #ff2b2b; /* primary red */
          --plasma-blue: #b30000;   /* deep red */
          --energy-glow: #ffffff;
          --dark-purple: #0f0f14;
          --accent-white: #ffffff;

          --code-bg: #0a0a0f;
          --code-border: #2a0f0f;
        }

        body {
          background: var(--void-black);
          color: var(--accent-white);
          font-family: 'Rajdhani', sans-serif;
          overflow-x: hidden;
        }

        .portfolio { position: relative; min-height: 100vh; }

        /* HERO */
        .hero {
          position: relative;
          isolation: isolate;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* ambient haze */
        .hero::before{
          content:'';
          position:absolute;
          inset:-25%;
          background:
            radial-gradient(circle at 20% 40%, rgba(255,255,255,0.04) 0%, transparent 55%),
            radial-gradient(circle at 70% 30%, rgba(255,0,0,0.05) 0%, transparent 60%),
            radial-gradient(circle at 40% 70%, rgba(255,255,255,0.03) 0%, transparent 60%),
            radial-gradient(circle at 80% 75%, rgba(179,0,0,0.04) 0%, transparent 65%);
          filter: blur(22px);
          opacity: 0.9;
          animation: smoke-drift 18s ease-in-out infinite alternate;
          z-index: 0;
        }

        @keyframes smoke-drift {
          0%   { transform: translate(0%, 0%) scale(1); opacity: 0.35; }
          50%  { transform: translate(-4%, 3%) scale(1.05); opacity: 0.45; }
          100% { transform: translate(5%, -3%) scale(1.1); opacity: 0.35; }
        }

        .hero-content{
          position:relative;
          z-index:3;
          text-align:center;
          padding:2rem;
        }

        .hero-title{
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 900;
          margin-bottom: 1rem;

          background: linear-gradient(135deg,
            #ff0000 0%,
            #ff0000 45%,
            #ffffff 45%,
            #ffffff 55%,
            #ff0000 55%,
            #ff0000 100%
          );

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          letter-spacing: 0.05em;
        }

        .hero-subtitle{
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: 300;
          color: var(--energy-glow);
          margin-bottom: 3rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* EMBERS LAYER */
        .energy-particles{
          position:absolute;
          inset:0;
          z-index:2;
          pointer-events:none;
          overflow:hidden;

          /* keep it concentrated lower like “heat” */
          mask-image: linear-gradient(to top, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%);
        }

        .ember{
          position:absolute;
          border-radius: 999px;
          mix-blend-mode: screen;
          will-change: transform, opacity;
          animation: ember-rise linear infinite;
        }

        .ember::after{
          content:"";
          position:absolute;
          inset: calc(-1 * var(--glow, 14px));
          border-radius:999px;
          background: radial-gradient(circle, rgba(255,0,0,0.24), rgba(255,0,0,0));
          filter: blur(6px);
          opacity: 0.65;
        }

        @keyframes ember-rise{
          0%   { transform: translate3d(0, 24vh, 0) scale(1); opacity: 0; }
          8%   { opacity: 1; }
          100% { transform: translate3d(var(--dx, 0px), -120vh, 0) scale(0.8); opacity: 0; }
        }

        .nav-hint{
          font-size: 1rem;
          color: var(--plasma-blue);
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* NAV */
        nav{
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 1.5rem 3rem;
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 0, 0, 0.10);
        }

        .nav-links{
          display:flex;
          justify-content:center;
          gap:3rem;
          list-style:none;
        }

        .nav-link{
          color: var(--accent-white);
          text-decoration:none;
          font-size:1.1rem;
          font-weight:500;
          letter-spacing:0.1em;
          text-transform:uppercase;
          position:relative;
          transition: color 0.3s;
        }

        .nav-link::after{
          content:'';
          position:absolute;
          bottom:-5px; left:0;
          width:0;
          height:2px;
          background: var(--electric-cyan);
          box-shadow: 0 0 10px var(--electric-cyan);
          transition: width 0.3s;
        }

        .nav-link:hover::after,
        .nav-link.active::after{
          width:100%;
        }

        .nav-link:hover{ color: var(--electric-cyan); }

        /* Sections */
        section{
          min-height:100vh;
          padding:6rem 3rem;
          position:relative;
        }

        .section-title{
          font-family:'Orbitron', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight:700;
          background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 25%, #ff2b2b 100%);
          margin-bottom:4rem;
          text-align:center;
          text-transform:uppercase;
          letter-spacing:0.1em;
          position:relative;

          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .section-title::after{
          content:'';
          position:absolute;
          bottom:-1rem;
          left:50%;
          transform:translateX(-50%);
          width:150px;
          height:3px;
          background: linear-gradient(90deg, transparent, var(--electric-cyan), transparent);
          box-shadow: 0 0 25px var(--electric-cyan);
        }

        /* Projects Grid */
        .projects-grid{
          display:grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap:2rem;
          max-width:1400px;
          margin:0 auto;
        }

        .project-card{
          background: linear-gradient(135deg, var(--deep-shadow) 0%, var(--midnight-blue) 100%);
          border: 1px solid rgba(255,0,0,0.25);
          border-radius:12px;
          overflow:hidden;
          cursor:pointer;
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          position:relative;
        }

        .project-card:hover{
          transform: translateY(-10px);
          border-color: var(--electric-cyan);
          box-shadow: 0 20px 60px rgba(255,0,0,0.25);
        }

        .project-thumbnail{
          width:100%;
          height:250px;
          object-fit:cover;
          display:block;
        }

        .project-info{ padding: 1.5rem; }

        .project-title{
          font-family:'Orbitron', sans-serif;
          font-size:1.5rem;
          font-weight:600;
          color: var(--electric-cyan);
          margin-bottom:0.5rem;
        }

        .project-description{
          font-size:1rem;
          color: var(--accent-white);
          line-height:1.6;
          margin-bottom:1rem;
          opacity:0.9;
        }

        .project-tags{
          display:flex;
          flex-wrap:wrap;
          gap:0.5rem;
        }

        .tag{
          padding:0.3rem 0.8rem;
          background: rgba(255,0,0,0.10);
          border: 1px solid rgba(255,0,0,0.25);
          border-radius:20px;
          font-size:0.85rem;
          color: var(--energy-glow);
        }

        /* Code */
        .code-grid{
          display:grid;
          gap:2rem;
          max-width:1400px;
          margin:0 auto;
        }

        .code-card{
          background: var(--code-bg);
          border: 2px solid var(--code-border);
          border-radius:12px;
          overflow:hidden;
          transition: all 0.4s;
        }

        .code-card:hover{
          border-color: var(--electric-cyan);
          box-shadow: 0 10px 40px rgba(255,0,0,0.18);
        }

        .code-header{
          padding:1.5rem;
          background: linear-gradient(135deg, var(--deep-shadow), var(--midnight-blue));
          border-bottom: 1px solid var(--code-border);
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:1rem;
        }

        .code-header-left{ flex:1; }

        .code-title{
          font-family:'Orbitron', sans-serif;
          font-size:1.3rem;
          color: var(--electric-cyan);
          margin-bottom:0.5rem;
          display:flex;
          align-items:center;
          gap:0.5rem;
        }

        .code-category{
          display:inline-block;
          padding:0.3rem 0.8rem;
          background: rgba(255,0,0,0.10);
          border: 1px solid rgba(255,0,0,0.25);
          border-radius:20px;
          font-size:0.8rem;
          color: var(--energy-glow);
          margin-bottom:0.5rem;
        }

        .code-description{
          color: var(--accent-white);
          opacity:0.8;
          line-height:1.5;
          font-size:0.95rem;
        }

        .code-actions{ display:flex; gap:0.5rem; }

        .code-btn{
          padding:0.5rem 1rem;
          background: rgba(255,0,0,0.10);
          border: 1px solid rgba(255,0,0,0.25);
          border-radius:6px;
          color: var(--accent-white);
          font-family:'Rajdhani', sans-serif;
          font-size:0.9rem;
          font-weight:500;
          cursor:pointer;
          transition: all 0.3s;
          display:flex;
          align-items:center;
          gap:0.3rem;
          text-decoration:none;
        }

        .code-btn:hover{
          background: var(--electric-cyan);
          color: var(--void-black);
          box-shadow: 0 0 15px var(--electric-cyan);
        }

        .code-block{
          padding:1.5rem;
          background: var(--code-bg);
          overflow-x:auto;
          max-height:400px;
          position:relative;
        }

        .code-content{
          font-family:'JetBrains Mono', monospace;
          font-size:0.9rem;
          line-height:1.6;
          color:#e6e6e6;
          white-space:pre;
        }

        /* Gallery */
        .image-gallery{
          max-width:1200px;
          margin:0 auto;
          position:relative;
        }

        .gallery-viewer{
          position:relative;
          width:100%;
          height:600px;
          border-radius:12px;
          overflow:hidden;
          border: 2px solid var(--electric-cyan);
          box-shadow: 0 0 40px rgba(255,0,0,0.2);
        }

        .gallery-image{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
        }

        .gallery-nav{
          position:absolute;
          top:50%;
          transform: translateY(-50%);
          background: rgba(255,0,0,0.16);
          border: 1px solid var(--electric-cyan);
          border-radius:50%;
          width:50px;
          height:50px;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .gallery-nav:hover{
          background: var(--electric-cyan);
          box-shadow: 0 0 20px var(--electric-cyan);
        }

        .gallery-nav.prev{ left:20px; }
        .gallery-nav.next{ right:20px; }

        .gallery-indicators{
          display:flex;
          justify-content:center;
          gap:1rem;
          margin-top:2rem;
        }

        .indicator{
          width:12px;
          height:12px;
          border-radius:50%;
          background: rgba(255,0,0,0.25);
          border: 1px solid rgba(255,0,0,0.5);
          cursor:pointer;
          transition: all 0.3s;
        }

        .indicator.active{
          background: var(--electric-cyan);
          box-shadow: 0 0 15px var(--electric-cyan);
        }

        /* Unity Build */
        .unity-build{
          max-width:800px;
          margin:0 auto;
          background: linear-gradient(135deg, var(--deep-shadow) 0%, var(--dark-purple) 100%);
          border: 2px solid var(--electric-cyan);
          border-radius:16px;
          padding:3rem;
          box-shadow: 0 0 60px rgba(255,0,0,0.15);
        }

        .build-title{
          font-family:'Orbitron', sans-serif;
          font-size:2rem;
          color: var(--electric-cyan);
          margin-bottom:1rem;
          text-align:center;
        }

        .build-description{
          text-align:center;
          font-size:1.1rem;
          color: var(--accent-white);
          margin-bottom:2rem;
          opacity:0.9;
        }

        .success-text{
          color: var(--energy-glow);
          font-size:1.2rem;
          font-weight:600;
          margin-bottom:0.5rem;
        }

        /* Modal */
        .modal-overlay{
          position:fixed;
          inset:0;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:2000;
          padding:2rem;
        }

        .modal-content{
          position:relative;
          max-width:90vw;
          max-height:90vh;
          background: var(--deep-shadow);
          border: 2px solid var(--electric-cyan);
          border-radius:16px;
          padding:2rem;
          box-shadow: 0 0 100px rgba(255,0,0,0.25);
          overflow:auto;
        }

        .modal-close{
          position:absolute;
          top:1rem;
          right:1rem;
          background: rgba(255,0,0,0.18);
          border: 1px solid var(--electric-cyan);
          border-radius:50%;
          width:40px;
          height:40px;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          transition: all 0.3s;
          z-index:10;
        }

        .modal-close:hover{
          background: var(--electric-cyan);
          box-shadow: 0 0 20px var(--electric-cyan);
        }

        .modal-video{
          width:100%;
          max-width:1200px;
          border-radius:8px;
        }

        .modal-code-content{ padding-top:2rem; }

        /* Responsive */
        @media (max-width: 768px){
          .nav-links{ gap:1rem; flex-wrap:wrap; }
          .nav-link{ font-size:0.9rem; }
          section{ padding:4rem 1.5rem; }
          .projects-grid{ grid-template-columns: 1fr; }
          .gallery-viewer{ height:400px; }
          .unity-build{ padding:2rem 1.5rem; }
          .code-header{ flex-direction:column; }
          .code-actions{ width:100%; }
          .code-btn{ flex:1; justify-content:center; }
        }
      `}</style>

      {/* Navigation */}
      <nav>
        <ul className="nav-links">
          <li>
            <a
              href="#hero"
              className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#projects"
              className={`nav-link ${
                activeSection === 'projects' ? 'active' : ''
              }`}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#code"
              className={`nav-link ${activeSection === 'code' ? 'active' : ''}`}
            >
              Code
            </a>
          </li>
          <li>
            <a
              href="#media"
              className={`nav-link ${
                activeSection === 'media' ? 'active' : ''
              }`}
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              href="#unity"
              className={`nav-link ${
                activeSection === 'unity' ? 'active' : ''
              }`}
            >
              Demo
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero" ref={heroRef}>
        {/* Embers */}
        <div className="energy-particles">
          {embers.map((e) => (
            <div
              key={e.id}
              className="ember"
              style={{
                left: `${e.left}%`,
                top: `${e.top}%`,
                width: `${e.size}px`,
                height: `${e.size}px`,
                background: e.color,
                opacity: e.alpha,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
                ['--dx']: `${e.dx}px`,
                ['--glow']: `${e.glow}px`,
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Michael Hammond Portfolio</h1>
          <p className="hero-subtitle">Mid-Level Game Developer</p>
          <p className="nav-hint">↓ Scroll to explore ↓</p>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => project.video && setSelectedMedia(project)}
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="project-thumbnail"
              />
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Showcase Section */}
      <section id="code">
        <h2 className="section-title">Code Examples</h2>
        <div className="code-grid">
          {codeExamples.map((example) => (
            <div key={example.id} className="code-card">
              <div className="code-header">
                <div className="code-header-left">
                  <div className="code-category">{example.category}</div>
                  <h3 className="code-title">
                    <Code size={20} />
                    {example.title}
                  </h3>
                  <p className="code-description">{example.description}</p>
                </div>
                <div className="code-actions">
                  <button
                    className="code-btn"
                    onClick={() => copyCode(example.code, example.id)}
                  >
                    {copiedCode === example.id ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                    {copiedCode === example.id ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    className="code-btn"
                    onClick={() => setSelectedCode(example)}
                  >
                    <Eye size={16} />
                    Expand
                  </button>
                </div>
              </div>
              <div className="code-block">
                <pre className="code-content">{example.code}</pre>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media Gallery Section */}
      <section id="media">
        <h2 className="section-title">Gallery</h2>
        <div className="image-gallery">
          <div className="gallery-viewer">
            <img
              src={images[currentImageIndex]}
              alt={`Gallery ${currentImageIndex + 1}`}
              className="gallery-image"
            />
            <div className="gallery-nav prev" onClick={prevImage}>
              <ChevronLeft />
            </div>
            <div className="gallery-nav next" onClick={nextImage}>
              <ChevronRight />
            </div>
          </div>
          <div className="gallery-indicators">
            {images.map((_, index) => (
              <div
                key={index}
                className={`indicator ${
                  index === currentImageIndex ? 'active' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Unity Build Section */}
      <section id="unity">
        <h2 className="section-title">Unity Demo Build</h2>
        <div className="unity-build">
          <h3 className="build-title">{unityBuild.title}</h3>
          <p className="build-description">{unityBuild.description}</p>

          <p
            className="success-text"
            style={{ textAlign: 'center', marginBottom: '1.5rem' }}
          >
            ✓ Sub-Quest Complete
          </p>

          <div style={{ textAlign: 'center' }}>
            <a
              href={unityBuild.downloadUrl}
              download
              className="code-btn"
              style={{ textDecoration: 'none', display: 'inline-flex' }}
            >
              <Download size={20} />
              Download Build
            </a>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedMedia && selectedMedia.video && (
        <div className="modal-overlay" onClick={() => setSelectedMedia(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-close" onClick={() => setSelectedMedia(null)}>
              <X />
            </div>
            <h3
              style={{
                fontFamily: 'Orbitron',
                color: 'var(--electric-cyan)',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              {selectedMedia.title}
            </h3>
            <video
              className="modal-video"
              controls
              autoPlay
              src={selectedMedia.video}
            />
          </div>
        </div>
      )}

      {/* Code Expand Modal */}
      {selectedCode && (
        <div className="modal-overlay" onClick={() => setSelectedCode(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '1200px' }}
          >
            <div className="modal-close" onClick={() => setSelectedCode(null)}>
              <X />
            </div>
            <div className="modal-code-content">
              <div className="code-category">{selectedCode.category}</div>
              <h3 className="code-title" style={{ marginBottom: '0.5rem' }}>
                <Code size={24} />
                {selectedCode.title}
              </h3>
              <p
                className="code-description"
                style={{ marginBottom: '1.5rem' }}
              >
                {selectedCode.description}
              </p>
              <div
                style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}
              >
                <button
                  className="code-btn"
                  onClick={() => copyCode(selectedCode.code, selectedCode.id)}
                >
                  {copiedCode === selectedCode.id ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                  {copiedCode === selectedCode.id ? 'Copied!' : 'Copy Code'}
                </button>
                {selectedCode.github && (
                  <a
                    href={selectedCode.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="code-btn"
                  >
                    <ExternalLink size={16} />
                    View on GitHub
                  </a>
                )}
              </div>
              <div className="code-block" style={{ maxHeight: '70vh' }}>
                <pre className="code-content">{selectedCode.code}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
