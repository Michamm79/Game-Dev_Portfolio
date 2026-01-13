import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  Download,
  Lock,
  Play,
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
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      
      Transform originalCamParent = mainCamera.transform.parent;
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

  public IEnumerator BossFinisherCinematic(BossHealth boss)
  {
      PlayerController player = PlayerController.Instance;
      player.enabled = false;
      
      player.transform.position = playerSpecialPosition.position;
      
      Animator playerAnimator = player.GetComponent<Animator>();
      playerAnimator.SetTrigger("Special");
      
      if (specialAttackVFX != null)
      {
          GameObject vfx = Instantiate(specialAttackVFX, 
              playerSpecialPosition.position, 
              playerSpecialPosition.rotation);
          Destroy(vfx, finisherCinematicDuration);
      }
      
      mainCamera.transform.position = 
          playerSpecialPosition.position + finisherCameraOffset;
      mainCamera.transform.LookAt(playerSpecialPosition.position + Vector3.up * 2f);
      
      yield return new WaitForSeconds(finisherCinematicDuration);
      
      player.enabled = true;
      boss.Die();
    }
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
        'Dramatic weapon evolution sequence triggered on player "death" during boss fight. Freezes time, plays blood essence animation, offers weapon choice, then revives player with new powers and unlocks special attack.',
      code: `public class EvolutionSequenceManager : MonoBehaviour
{
    public static EvolutionSequenceManager Instance { get; private set; }

    [Header("References")]
    [SerializeField] private GameObject weaponEvolutionPanel;
    [SerializeField] public BossHealth bossHealth;
    
    [Header("Animation Settings")]
    [SerializeField] private float bloodEssenceDuration = 3f;
    [SerializeField] private string evolutionMessage = "It's dangerous to go alone, choose your path...";
    
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
        
        // Only trigger if boss is invincible (scripted moment)
        if (bossHealth != null && !bossHealth.isInvincible) return;

        evolutionTriggered = true;
        StartCoroutine(EvolutionSequence());
    }

    private IEnumerator EvolutionSequence()
    {
        Debug.Log("Evolution sequence starting...");

        // Freeze time for dramatic effect
        Time.timeScale = 0f;
        
        yield return new WaitForSecondsRealtime(1f);

        // Play blood essence animation
        PlayBloodEssenceAnimation();
        yield return new WaitForSecondsRealtime(bloodEssenceDuration);

        // Revive player
        if (PlayerHealth.Instance != null)
        {
            PlayerHealth.Instance.RevivePlayer();
        }

        // Show mysterious voice subtitle
        if (SubtitleUI.Instance != null)
        {
            SubtitleUI.Instance.ShowSubtitle(evolutionMessage, 3f);
        }

        yield return new WaitForSecondsRealtime(1f);

        // Open weapon choice UI
        if (weaponEvolutionPanel != null)
        {
            weaponEvolutionPanel.SetActive(true);
        }
    }

    private void PlayBloodEssenceAnimation()
    {
        if (PlayerHealth.Instance != null)
        {
            Animator playerAnimator = PlayerHealth.Instance.GetComponent<Animator>();
            if (playerAnimator != null)
            {
                playerAnimator.updateMode = AnimatorUpdateMode.UnscaledTime;
                playerAnimator.SetTrigger("TriggerEvolution");
            }
        }
    }

    public void OnWeaponEvolutionSelected(string weaponName)
    {
        Debug.Log($"Player selected: {weaponName}");
        StartCoroutine(CompleteEvolutionSequence());
    }

    private IEnumerator CompleteEvolutionSequence()
    {
        // Close UI
        if (weaponEvolutionPanel != null)
        {
            weaponEvolutionPanel.SetActive(false);
        }

        yield return new WaitForSecondsRealtime(0.5f);

        // Resume time
        Time.timeScale = 1f;

        // Make player invincible temporarily
        if (PlayerHealth.Instance != null)
        {
            PlayerHealth.Instance.isInvincible = true;
        }
        
        // Unlock special attack for boss fight
        PlayerController playerController = PlayerController.Instance;
        if (playerController != null)
        {
            playerController.UnlockSpecialAttack();
        }

        // Make boss vulnerable now
        if (bossHealth != null)
        {
            bossHealth.isInvincible = false;
        }

        Debug.Log("Evolution complete! Boss vulnerable, player empowered!");
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
        'Coordinated enemy AI preventing "dog-piling" - enemies take turns attacking while others circle the player. Uses static coordination and timing to create engaging combat.',
      code: `public class PackBehaviorAI : MonoBehaviour
{
  [Header("Pack Behavior Settings")]
  [SerializeField] private int maxSimultaneousAttackers = 2;
  [SerializeField] private float attackCoordinationDelay = 1.5f;
  [SerializeField] private float circleDistance = 4f;
  [SerializeField] private float packDetectionRange = 20f;

  private static List<PackBehaviorAI> allPackMembers = new List<PackBehaviorAI>();
  private static float lastPackAttackTime = 0f;
  
  private EnemyAI enemyAI;
  private Transform player;
  private bool isWaitingTurn = false;
  private Vector3 circlePosition;
  private float circleAngle;

  void OnEnable()
  {
      if (!allPackMembers.Contains(this))
      {
          allPackMembers.Add(this);
      }
  }

  void Update()
  {
      UpdatePackBehavior();
  }

  private void UpdatePackBehavior()
  {
      List<PackBehaviorAI> nearbyPack = GetNearbyPackMembers();
      int currentAttackers = CountCurrentAttackers(nearbyPack);

      float distanceToPlayer = Vector3.Distance(transform.position, player.position);
      
      if (distanceToPlayer <= enemyAI.GetAttackRange())
      {
          bool canAttack = CanAttackNow(currentAttackers);
          
          if (canAttack)
          {
              isWaitingTurn = false;
              enemyAI.SetCanAttack(true);
          }
          else
          {
              // Wait turn and circle
              isWaitingTurn = true;
              enemyAI.SetCanAttack(false);
              CircleAroundPlayer();
          }
      }
  }

  private void CircleAroundPlayer()
  {
      circleAngle += circleSpeed * Time.deltaTime * 50f;
      
      float radians = circleAngle * Mathf.Deg2Rad;
      Vector3 offset = new Vector3(
          Mathf.Cos(radians) * circleDistance,
          0f,
          Mathf.Sin(radians) * circleDistance
      );

      circlePosition = player.position + offset;
      enemyAI.SetCircleTarget(circlePosition);
  }

  private bool CanAttackNow(int currentAttackers)
  {
      if (currentAttackers >= maxSimultaneousAttackers)
          return false;

      if (Time.time < lastPackAttackTime + attackCoordinationDelay)
          return false;

      return true;
  }

  public void OnAttackExecuted()
  {
      lastPackAttackTime = Time.time;
  }

  private List<PackBehaviorAI> GetNearbyPackMembers()
  {
      return allPackMembers
          .Where(p => p != this && p.gameObject.activeInHierarchy)
          .Where(p => Vector3.Distance(transform.position, p.transform.position) 
              <= packDetectionRange)
          .ToList();
  }

  private int CountCurrentAttackers(List<PackBehaviorAI> packMembers)
  {
      int count = enemyAI.GetCurrentState() == EnemyAI.EnemyState.Attacking ? 1 : 0;
      
      foreach (var member in packMembers)
      {
          if (member.enemyAI.GetCurrentState() == EnemyAI.EnemyState.Attacking)
              count++;
      }

      return count;
  }
}`,
    },
    {
      id: 4,
      title: 'Photon Networking - State Synchronization',
      category: 'Networking',
      language: 'csharp',
      description:
        'Custom RPC system for syncing fire simulation state across multiplayer clients',
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

  public void BroadcastFireUpdate(int fireID, bool isActive, float intensity)
  {
      photonView.RPC("SyncFireState", RpcTarget.Others, fireID, isActive, intensity);
  }

  public override void OnPlayerEnteredRoom(Player newPlayer)
  {
      if (PhotonNetwork.IsMasterClient)
      {
          // Sync all active fires to new player
          foreach (var fire in FireManager.Instance.GetActiveFires())
          {
              photonView.RPC("SyncFireState", newPlayer, 
                  fire.ID, fire.IsActive, fire.CurrentIntensity);
          }
      }
  }
}`,
    },
    {
      id: 5,
      title: 'XR Interaction - Spray Mechanic',
      category: 'VR/AR',
      language: 'csharp',
      description:
        'Fire extinguisher spray system with particle effects and physics-based interaction',
      code: `public class ExtinguisherSpray : XRGrabInteractable
{
  [SerializeField] private ParticleSystem sprayParticles;
  [SerializeField] private LayerMask fireLayer;
  [SerializeField] private float sprayForce = 10f;
  [SerializeField] private float extinguishRate = 0.5f;

  private bool isSpraying;
  private List<ParticleCollisionEvent> collisionEvents = new List<ParticleCollisionEvent>();

  protected override void OnActivated(ActivateEventArgs args)
  {
      base.OnActivated(args);
      StartSpray();
  }

  protected override void OnDeactivated(DeactivateEventArgs args)
  {
      base.OnDeactivated(args);
      StopSpray();
  }

  private void StartSpray()
  {
      isSpraying = true;
      sprayParticles.Play();
      AudioManager.Instance.PlaySpraySound(transform.position);
  }

  private void OnParticleCollision(GameObject other)
  {
      int numCollisions = sprayParticles.GetCollisionEvents(other, collisionEvents);

      for (int i = 0; i < numCollisions; i++)
      {
          var collision = collisionEvents[i];
          
          if (other.TryGetComponent<FireSource>(out var fire))
          {
              fire.ReduceIntensity(extinguishRate * Time.deltaTime);
              
              // Network sync if multiplayer
              if (PhotonNetwork.IsConnected)
              {
                  NetworkManager.Instance.SyncFireIntensity(fire.ID, fire.CurrentIntensity);
              }
          }
      }
  }
}`,
    },
    {
      id: 6,
      title: 'AR Data Visualization - Interactive 3D Charts',
      category: 'Data Visualization',
      language: 'csharp',
      description:
        'Network-synced 3D chart system with proximity-based detail windows',
      code: `public class Interactive3DChart : MonoBehaviourPunCallbacks, IPunObservable
{
  public ChartType Type { get; set; }
  public List<DataPoint> Data { get; private set; }
  
  private GameObject detailWindow;
  private bool isWindowVisible;

  void Update()
  {
      CheckUserProximity();
  }

  private void CheckUserProximity()
  {
      float distance = Vector3.Distance(transform.position, XRCamera.Instance.transform.position);
      
      if (distance < 0.5f && !isWindowVisible)
      {
          ShowDetailWindow();
      }
      else if (distance > 0.7f && isWindowVisible)
      {
          HideDetailWindow();
      }
  }

  [PunRPC]
  private void ShowDetailWindowRPC()
  {
      detailWindow = Instantiate(chartDetailPrefab, transform.position + Vector3.up * 0.3f, Quaternion.identity);
      detailWindow.GetComponent<ChartDetailWindow>().Initialize(Data);
      isWindowVisible = true;
  }

  public void OnPhotonSerializeView(PhotonStream stream, PhotonMessageInfo info)
  {
      if (stream.IsWriting)
      {
          stream.SendNext(isWindowVisible);
      }
      else
      {
          isWindowVisible = (bool)stream.ReceiveNext();
      }
  }

  public void UpdateChartData(List<DataPoint> newData)
  {
      Data = newData;
      RegenerateChart();
      
      if (PhotonNetwork.IsMasterClient)
      {
          photonView.RPC("SyncChartData", RpcTarget.Others, SerializeData(newData));
      }
  }
}`,
    },
    {
      id: 7,
      title: 'Custom Unity Editor - Pathfinding Visualizer',
      category: 'Editor Tools',
      language: 'csharp',
      description:
        'Editor tool for visualizing and debugging navigation paths in the scene view',
      code: `[CustomEditor(typeof(NavPathVisualizer))]
public class NavPathVisualizerEditor : Editor
{
  private NavPathVisualizer visualizer;

  void OnEnable()
  {
      visualizer = (NavPathVisualizer)target;
  }

  public override void OnInspectorGUI()
  {
      DrawDefaultInspector();

      EditorGUILayout.Space();
      EditorGUILayout.LabelField("Visualization", EditorStyles.boldLabel);

      if (GUILayout.Button("Calculate Path"))
      {
          visualizer.CalculatePath();
          SceneView.RepaintAll();
      }

      if (GUILayout.Button("Clear Path"))
      {
          visualizer.ClearPath();
          SceneView.RepaintAll();
      }
  }

  void OnSceneGUI()
  {
      if (visualizer.Path == null || visualizer.Path.Count < 2) return;

      Handles.color = Color.cyan;
      for (int i = 0; i < visualizer.Path.Count - 1; i++)
      {
          Handles.DrawLine(visualizer.Path[i], visualizer.Path[i + 1], 3f);
          Handles.SphereHandleCap(0, visualizer.Path[i], Quaternion.identity, 0.2f, EventType.Repaint);
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
      thumbnail:
        'https://i.ibb.co/JWhS0Q81/Project-Maelstrom-Environment-Character.jpg',
      video: 'your-video-url.mp4',
      description:
        'Inclusive Action-RPG where players unknowingly exist in a hyper-realistic virtual experiment.Multiplayer coming.',
      tags: ['Game Development', 'Action-RPG', 'ML.NET', 'C# - C++'],
    },
    {
      id: 2,
      title: 'B52 Training Suite (Military Contract)',
      category: 'VR/Military - AAA-Scale Production',
      thumbnail:
        'https://i.ibb.co/cKCsGgzk/B52-Training-Immersive-Environment.jpg',
      video: 'YOUR-YOUTUBE-LINK-HERE', // Add your YouTube link!
      description:
        'Multi-million dollar fully immersive military B52 training system for the United States Air Force. Multiple trainees linked using Normcore (migrated to Photon) enabling simultaneous role-based training. Allows multiple personnel to perform different aircraft operation jobs in real-time collaborative scenarios, preparing crews for actual mission conditions. Results compared against traditional training methods showed significant improvement in readiness and retention.',
      tags: [
        'Unity',
        'VR',
        'Photon PUN',
        'Normcore',
        'Military Contract',
        'AAA-Scale',
        'Multiplayer',
        'B52',
      ],
    },
    {
      id: 3,
      title: 'Sensorama R&D Project',
      category: 'VR/AR & Robotics',
      thumbnail: 'https://i.ibb.co/hvChHNC/Sensorama-External.png',
      description:
        'Holographic content placement system using OVR and Photon networking',
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
    password: 'BRADAMANTE',
    downloadUrl:
      'https://drive.google.com/uc?export=download&id=1UN2JscSoITkEnWKtlrVL6CnSK9TLkf6M',
    description:
      'Password Protected - available for inquiries. Begin your adventure in a new world, survive the Maelstrom.',
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'projects', 'code', 'media', 'unity'];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === unityBuild.password) {
      setIsUnlocked(true);
      setTimeout(() => setShowPassword(false), 2000);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="portfolio">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --void-black: #0a0a0f;
          --deep-shadow: #121218;
          --midnight-blue: #1a1a2e;
          --electric-cyan: #00d9ff;
          --plasma-blue: #0099ff;
          --energy-glow: #66ffff;
          --dark-purple: #1e1e3f;
          --accent-white: #e8f4f8;
          --code-bg: #0d1117;
          --code-border: #1a2332;
        }

        body {
          background: var(--void-black);
          color: var(--accent-white);
          font-family: 'Rajdhani', sans-serif;
          overflow-x: hidden;
        }

        .portfolio {
          position: relative;
          min-height: 100vh;
        }

        /* Animated Background */
        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(109, 40, 217, 0.1) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          50% { transform: translate(-5%, 5%) scale(1.1); opacity: 1; }
        }

        @keyframes flame-rise {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.8; 
          }
          50% { 
            transform: translateY(-5%) scale(1.05); 
            opacity: 1; 
          }
        }

        .hero::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(180deg, transparent 0%, var(--void-black) 100%);
          pointer-events: none;
        }

        .energy-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 30%;
          animation: float-up 6s linear infinite;
        }
        
        .particle::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 50px;
          background: linear-gradient(to bottom, 
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.4) 30%,
            transparent 100%);
          top: 3px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          filter: blur(1px);
        }
        
        /* Purple/violet colored particles */
        .particle:nth-child(3n) {
          background: #8b5cf6;  /* Violet */
          box-shadow: 0 0 15px #8b5cf6;
        }
        
        .particle:nth-child(3n+1) {
          background: #a78bfa;  /* Light purple */
          box-shadow: 0 0 15px #a78bfa;
        }
        
        .particle:nth-child(3n+2) {
          background: #6d28d9;  /* Deep purple */
          box-shadow: 0 0 15px #6d28d9;
        }

        @keyframes float-up {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 2rem;
        }

        .hero-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 900;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--electric-cyan) 0%, var(--energy-glow) 50%, var(--plasma-blue) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 80px rgba(0, 217, 255, 0.3);
          animation: title-glow 3s ease-in-out infinite;
          letter-spacing: 0.05em;
        }

        @keyframes title-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: 300;
          color: var(--energy-glow);
          margin-bottom: 3rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .nav-hint {
          font-size: 1rem;
          color: var(--plasma-blue);
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Navigation */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.5rem 3rem;
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 217, 255, 0.1);
        }

        .nav-links {
          display: flex;
          justify-content: center;
          gap: 3rem;
          list-style: none;
        }

        .nav-link {
          color: var(--accent-white);
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          position: relative;
          transition: color 0.3s;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--electric-cyan);
          box-shadow: 0 0 10px var(--electric-cyan);
          transition: width 0.3s;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-link:hover {
          color: var(--electric-cyan);
        }

        /* Sections */
        section {
          min-height: 100vh;
          padding: 6rem 3rem;
          position: relative;
        }

        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: var(--electric-cyan);
          margin-bottom: 4rem;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--electric-cyan), transparent);
          box-shadow: 0 0 20px var(--electric-cyan);
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .project-card {
          background: linear-gradient(135deg, var(--deep-shadow) 0%, var(--midnight-blue) 100%);
          border: 1px solid rgba(0, 217, 255, 0.2);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .project-card:hover {
          transform: translateY(-10px);
          border-color: var(--electric-cyan);
          box-shadow: 0 20px 60px rgba(0, 217, 255, 0.3);
        }

        .project-card:hover::before {
          opacity: 1;
        }

        .project-thumbnail {
          width: 100%;
          height: 250px;
          object-fit: cover;
          display: block;
        }

        .project-info {
          padding: 1.5rem;
        }

        .project-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--electric-cyan);
          margin-bottom: 0.5rem;
        }

        .project-description {
          font-size: 1rem;
          color: var(--accent-white);
          line-height: 1.6;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.3rem 0.8rem;
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid rgba(0, 217, 255, 0.3);
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--energy-glow);
        }

        /* Code Showcase Section */
        .code-grid {
          display: grid;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .code-card {
          background: var(--code-bg);
          border: 2px solid var(--code-border);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.4s;
        }

        .code-card:hover {
          border-color: var(--electric-cyan);
          box-shadow: 0 10px 40px rgba(0, 217, 255, 0.2);
        }

        .code-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, var(--deep-shadow), var(--midnight-blue));
          border-bottom: 1px solid var(--code-border);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .code-header-left {
          flex: 1;
        }

        .code-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.3rem;
          color: var(--electric-cyan);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .code-category {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid rgba(0, 217, 255, 0.3);
          border-radius: 20px;
          font-size: 0.8rem;
          color: var(--energy-glow);
          margin-bottom: 0.5rem;
        }

        .code-description {
          color: var(--accent-white);
          opacity: 0.8;
          line-height: 1.5;
          font-size: 0.95rem;
        }

        .code-actions {
          display: flex;
          gap: 0.5rem;
        }

        .code-btn {
          padding: 0.5rem 1rem;
          background: rgba(0, 217, 255, 0.1);
          border: 1px solid rgba(0, 217, 255, 0.3);
          border-radius: 6px;
          color: var(--electric-cyan);
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          text-decoration: none;
        }

        .code-btn:hover {
          background: var(--electric-cyan);
          color: var(--void-black);
          box-shadow: 0 0 15px var(--electric-cyan);
        }

        .code-block {
          padding: 1.5rem;
          background: var(--code-bg);
          overflow-x: auto;
          max-height: 400px;
          position: relative;
        }

        .code-content {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #e6e6e6;
          white-space: pre;
        }

        /* Syntax highlighting colors */
        .keyword { color: #ff79c6; }
        .type { color: #8be9fd; }
        .string { color: #f1fa8c; }
        .comment { color: #6272a4; font-style: italic; }
        .function { color: #50fa7b; }
        .number { color: #bd93f9; }

        /* Image Gallery */
        .image-gallery {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .gallery-viewer {
          position: relative;
          width: 100%;
          height: 600px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid var(--electric-cyan);
          box-shadow: 0 0 40px rgba(0, 217, 255, 0.3);
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 217, 255, 0.2);
          border: 1px solid var(--electric-cyan);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .gallery-nav:hover {
          background: var(--electric-cyan);
          box-shadow: 0 0 20px var(--electric-cyan);
        }

        .gallery-nav.prev { left: 20px; }
        .gallery-nav.next { right: 20px; }

        .gallery-indicators {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(0, 217, 255, 0.3);
          border: 1px solid var(--electric-cyan);
          cursor: pointer;
          transition: all 0.3s;
        }

        .indicator.active {
          background: var(--electric-cyan);
          box-shadow: 0 0 15px var(--electric-cyan);
        }

        /* Unity Build Section */
        .unity-build {
          max-width: 800px;
          margin: 0 auto;
          background: linear-gradient(135deg, var(--deep-shadow) 0%, var(--dark-purple) 100%);
          border: 2px solid var(--electric-cyan);
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 0 60px rgba(0, 217, 255, 0.2);
        }

        .build-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          color: var(--electric-cyan);
          margin-bottom: 1rem;
          text-align: center;
        }

        .build-description {
          text-align: center;
          font-size: 1.1rem;
          color: var(--accent-white);
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .password-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .password-input {
          width: 100%;
          max-width: 400px;
          padding: 1rem 1.5rem;
          background: rgba(0, 217, 255, 0.05);
          border: 2px solid rgba(0, 217, 255, 0.3);
          border-radius: 8px;
          color: var(--accent-white);
          font-size: 1.1rem;
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.2em;
          text-align: center;
          transition: all 0.3s;
        }

        .password-input:focus {
          outline: none;
          border-color: var(--electric-cyan);
          box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
        }

        .btn {
          padding: 1rem 3rem;
          background: linear-gradient(135deg, var(--plasma-blue), var(--electric-cyan));
          border: none;
          border-radius: 8px;
          color: var(--void-black);
          font-family: 'Orbitron', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 50px rgba(0, 217, 255, 0.6);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .unlocked-message {
          text-align: center;
          padding: 2rem;
          background: rgba(0, 217, 255, 0.1);
          border: 2px solid var(--electric-cyan);
          border-radius: 8px;
          margin-bottom: 2rem;
          animation: pulse-border 2s ease-in-out infinite;
        }

        @keyframes pulse-border {
          0%, 100% { border-color: var(--electric-cyan); }
          50% { border-color: var(--energy-glow); }
        }

        .success-text {
          color: var(--energy-glow);
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .modal-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          background: var(--deep-shadow);
          border: 2px solid var(--electric-cyan);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 0 100px rgba(0, 217, 255, 0.5);
          overflow: auto;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 217, 255, 0.2);
          border: 1px solid var(--electric-cyan);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 10;
        }

        .modal-close:hover {
          background: var(--electric-cyan);
          box-shadow: 0 0 20px var(--electric-cyan);
        }

        .modal-video {
          width: 100%;
          max-width: 1200px;
          border-radius: 8px;
        }

        .modal-code-content {
          padding-top: 2rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links {
            gap: 1rem;
            flex-wrap: wrap;
          }
          
          .nav-link {
            font-size: 0.9rem;
          }

          section {
            padding: 4rem 1.5rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .gallery-viewer {
            height: 400px;
          }

          .unity-build {
            padding: 2rem 1.5rem;
          }

          .code-header {
            flex-direction: column;
          }

          .code-actions {
            width: 100%;
          }

          .code-btn {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      {/* Animated Background Particles */}
      <div className="energy-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

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
        <div className="hero-content">
          <h1 className="hero-title">Michael Hammond Portfolio</h1>
          <p className="hero-subtitle">VR/AR Game Developer</p>
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
              <ChevronLeft color="var(--electric-cyan)" />
            </div>
            <div className="gallery-nav next" onClick={nextImage}>
              <ChevronRight color="var(--electric-cyan)" />
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

          {!isUnlocked ? (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <Lock size={48} color="var(--electric-cyan)" />
              <input
                type="text"
                className="password-input"
                placeholder="ENTER ACCESS CODE"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value.toUpperCase())}
                maxLength={20}
              />
              <button type="submit" className="btn">
                <Eye size={20} />
                Unlock Access
              </button>
            </form>
          ) : (
            <>
              <div className="unlocked-message">
                <p className="success-text">✓ Access Granted</p>
                <p>Demo build unlocked and ready for download</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <a
                  href={unityBuild.downloadUrl}
                  download
                  className="btn"
                  style={{ textDecoration: 'none', display: 'inline-flex' }}
                >
                  <Download size={20} />
                  Download Build
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedMedia && selectedMedia.video && (
        <div className="modal-overlay" onClick={() => setSelectedMedia(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-close" onClick={() => setSelectedMedia(null)}>
              <X color="var(--electric-cyan)" />
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
              <X color="var(--electric-cyan)" />
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
