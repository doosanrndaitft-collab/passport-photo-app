export const ko = {
  appTitle: '여권사진 촬영 가이드',
  appSubtitle: '외교부 기준에 맞는 무보정 여권사진 촬영',

  // Wizard steps
  steps: {
    guide: '촬영 안내',
    camera: '카메라 설정',
    validation: '촬영',
    review: '결과 확인',
  },

  // Guide step
  guide: {
    title: '촬영 전 준비사항',
    subtitle: '여권사진 규격에 맞는 촬영을 위해 아래 사항을 확인해 주세요.',
    items: [
      {
        icon: '벽',
        title: '흰색 배경 준비',
        desc: '균일한 흰색 벽 앞에 서 주세요. 무늬, 그림, 액자가 없는 깨끗한 벽이 필요합니다.',
      },
      {
        icon: '조명',
        title: '조명 확인',
        desc: '얼굴에 그림자가 지지 않도록 밝은 곳에서 촬영하세요. 역광은 피해 주세요.',
      },
      {
        icon: '모자',
        title: '액세서리 제거',
        desc: '모자, 선글라스, 이어폰, 큰 장신구를 제거해 주세요. 일반 안경은 착용 가능하나 반사에 주의하세요.',
      },
      {
        icon: '머리',
        title: '머리카락 정리',
        desc: '눈썹, 눈, 얼굴 윤곽이 보이도록 머리카락을 정리해 주세요. 귀가 보이면 더 좋습니다.',
      },
      {
        icon: '카메라',
        title: '카메라 설정',
        desc: '뷰티 모드, 필터, 포트레이트 모드를 끄세요. 거치대 사용을 권장합니다.',
      },
      {
        icon: '거리',
        title: '적절한 거리',
        desc: '카메라와 약 1~1.5m 거리를 유지하세요. 너무 가까우면 얼굴이 왜곡됩니다.',
      },
    ],
    startButton: '촬영 시작하기',
    disclaimer:
      '본 앱은 외교부 여권사진 규격에 맞춰 촬영을 안내하는 도구이며, 사진을 편집하지 않습니다. 최종 여권 발급 심사 통과를 보장하지 않습니다.',
  },

  // Camera setup
  camera: {
    requesting: '카메라 접근 권한을 요청하고 있습니다...',
    denied: '카메라 접근이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해 주세요.',
    notFound: '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해 주세요.',
    error: '카메라를 시작할 수 없습니다.',
    ready: '카메라가 준비되었습니다.',
    proceed: '촬영 화면으로 이동',
  },

  // Validation checks
  checks: {
    faceDetected: '얼굴 감지',
    faceCentered: '얼굴 중앙 정렬',
    headSize: '머리 크기',
    headForward: '정면 응시',
    eyesOpen: '눈 뜸',
    mouthClosed: '입 다묾',
    backgroundWhite: '배경 흰색',
    noShadow: '그림자 없음',
    imageSharp: '선명도',
    noGlare: '안경 반사 없음',
  },

  // Guidance messages (shown when a check fails)
  guidance: {
    noFace: '얼굴이 감지되지 않습니다. 카메라를 정면으로 바라봐 주세요.',
    multipleFaces: '얼굴이 2개 이상 감지됩니다. 혼자 촬영해 주세요.',
    faceLeft: '얼굴을 오른쪽으로 이동해 주세요.',
    faceRight: '얼굴을 왼쪽으로 이동해 주세요.',
    faceUp: '얼굴을 아래로 이동해 주세요.',
    faceDown: '얼굴을 위로 이동해 주세요.',
    headTooSmall: '카메라에 더 가까이 와 주세요.',
    headTooLarge: '카메라에서 더 멀리 떨어져 주세요.',
    turnLeft: '얼굴을 왼쪽으로 약간 돌려 주세요.',
    turnRight: '얼굴을 오른쪽으로 약간 돌려 주세요.',
    lookDown: '고개를 약간 내려 주세요.',
    lookUp: '고개를 약간 올려 주세요.',
    headTilted: '고개를 바르게 세워 주세요.',
    lookForward: '정면을 바라봐 주세요.',
    eyesClosed: '눈을 떠 주세요.',
    mouthOpen: '입을 다물어 주세요.',
    smiling: '미소를 거두고 자연스러운 표정을 지어 주세요.',
    bgNotWhite: '배경이 흰색이 아닙니다. 흰 벽 앞으로 이동해 주세요.',
    bgObject: '배경에 물체가 보입니다. 깨끗한 배경으로 이동해 주세요.',
    shadowDetected: '그림자가 감지됩니다. 벽에서 50cm 이상 떨어지거나 조명을 조정해 주세요.',
    blurry: '사진이 흐립니다. 카메라를 고정하고 움직이지 마세요.',
    glareDetected: '안경에 빛 반사가 있습니다. 안경을 벗거나 조명 각도를 바꿔 주세요.',
    allPass: '조건이 충족되었습니다. 잠시만 유지해 주세요...',
  },

  // Auto-capture
  capture: {
    stabilizing: '촬영 중... 움직이지 마세요',
    captured: '촬영 완료!',
    retake: '다시 촬영',
    autoNotice: '모든 조건이 충족되면 1.5초 후 자동으로 촬영됩니다',
    autoNoticeShort: '조건 충족 시 자동 촬영',
  },

  // Review step
  review: {
    title: '촬영 결과',
    specs: '규격 정보',
    size: '크기',
    fileSize: '파일 크기',
    format: '형식',
    download: '여권사진 다운로드',
    retake: '다시 촬영하기',
    warning:
      '본 사진은 무보정 원본입니다. 외교부 온라인 신청 시 규격에 맞는지 다시 한 번 확인해 주세요.',
  },

  // Loading
  loading: {
    model: 'AI 모델을 불러오는 중...',
    modelDesc: '처음 한 번만 다운로드됩니다 (약 4MB)',
  },

  // Common
  back: '이전',
  next: '다음',
} as const;
