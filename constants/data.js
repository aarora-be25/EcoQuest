// EcoQuest — Mock Data
// Replace these with real API calls once your backend is ready

export const CURRENT_USER = {
  id:       'u001',
  name:     'Arjun Kumar',
  initials: 'AK',
  email:    'akumar4_be25@thapar.edu',
  branch:   'COE',
  year:     '1st',
  section:  'A',
  pts:      320,
  rank:     3,
  tasksCompleted: 12,
};

export const TASKS = [
  {
    id: 't001',
    icon: '♻️',
    name: 'Segregate waste',
    description: 'Sort your waste into wet, dry, and hazardous categories at the hostel or canteen bins. Take a clear photo of the sorted bins.',
    category: 'Waste',
    pts: 30,
    done: true,
    flagged: false,
  },
  {
    id: 't002',
    icon: '🚶',
    name: 'Walk to class',
    description: 'Walk or jog to your department instead of taking a vehicle or e-rickshaw. Take a photo of yourself near the department entrance.',
    category: 'Transport',
    pts: 20,
    done: true,
    flagged: false,
  },
  {
    id: 't003',
    icon: '🌿',
    name: 'Plant a sapling',
    description: 'Plant a sapling in the campus garden or your hostel area. Take a photo of yourself planting it. Co-ordinate with the campus green team.',
    category: 'Nature',
    pts: 50,
    done: false,
    flagged: false,
  },
  {
    id: 't004',
    icon: '💡',
    name: 'Turn off unused lights',
    description: 'Turn off lights, fans, and AC in any room you are leaving. Take a photo of the switched-off panel.',
    category: 'Energy',
    pts: 15,
    done: false,
    flagged: false,
  },
  {
    id: 't005',
    icon: '🚲',
    name: 'Cycle instead of auto',
    description: 'Use the campus cycle-sharing scheme instead of booking an auto or e-rickshaw. Take a photo with the cycle.',
    category: 'Transport',
    pts: 25,
    done: false,
    flagged: false,
  },
  {
    id: 't006',
    icon: '🪣',
    name: 'Collect rainwater',
    description: 'Set up a small container to collect rainwater and use it to water plants. Take a photo of the setup.',
    category: 'Water',
    pts: 35,
    done: false,
    flagged: false,
  },
  {
    id: 't007',
    icon: '🛍️',
    name: 'Refuse plastic bag',
    description: 'Bring your own bag to the campus shop or canteen and refuse a plastic bag. Take a photo with your reusable bag at checkout.',
    category: 'Waste',
    pts: 10,
    done: false,
    flagged: false,
  },
  {
    id: 't008',
    icon: '🍱',
    name: 'Carry reusable lunchbox',
    description: 'Bring your own tiffin box to the canteen instead of using disposable containers. Take a photo of your tiffin at the counter.',
    category: 'Waste',
    pts: 15,
    done: false,
    flagged: false,
  },
];

export const BRANCH_LEADERBOARD = [
  { id:'u010', initials:'PS', name:'Priya S.',   pts:480, branch:'3', bg:'#FAEEDA', fg:'#633806' },
  { id:'u011', initials:'RM', name:'Rohan M.',   pts:410, branch:'4', bg:'#E1F5EE', fg:'#085041' },
  { id:'u001', initials:'AK', name:'Arjun K.',   pts:320, branch:'1', bg:'#9FE1CB', fg:'#085041', you:true },
  { id:'u012', initials:'ST', name:'Simran T.',  pts:290, branch:'4', bg:'#FAEEDA', fg:'#633806' },
  { id:'u013', initials:'VK', name:'Varun K.',   pts:245, branch:'2', bg:'#E6F1FB', fg:'#0C447C' },
  { id:'u014', initials:'NR', name:'Nisha R.',   pts:210, branch:'3', bg:'#E1F5EE', fg:'#085041' },
  { id:'u015', initials:'AM', name:'Aditya M.',  pts:190, branch:'1', bg:'#FAEEDA', fg:'#633806' },
  { id:'u016', initials:'DG', name:'Dev G.',     pts:175, branch:'1', bg:'#E6F1FB', fg:'#0C447C' },
];

export const YEAR_LEADERBOARD = [
  { id:'u020', initials:'KL', name:'Kavya L.',   pts:510, branch:'ECE', bg:'#E1F5EE', fg:'#085041' },
  { id:'u010', initials:'PS', name:'Priya S.',   pts:480, branch:'COE', bg:'#FAEEDA', fg:'#633806' },
  { id:'u021', initials:'JM', name:'Jay M.',     pts:370, branch:'ME',  bg:'#E6F1FB', fg:'#0C447C' },
  { id:'u001', initials:'AK', name:'Arjun K.',   pts:320, branch:'COE', bg:'#9FE1CB', fg:'#085041', you:true },
  { id:'u012', initials:'ST', name:'Simran T.',  pts:290, branch:'RAI', bg:'#FAEEDA', fg:'#633806' },
  { id:'u022', initials:'DP', name:'Dev P.',     pts:260, branch:'EEE', bg:'#E1F5EE', fg:'#085041' },
  { id:'u023', initials:'LN', name:'Lara N.',    pts:230, branch:'DSAI',  bg:'#FAEEDA', fg:'#633806' },
  { id:'u024', initials:'RV', name:'Ravi V.',    pts:205, branch:'ME',  bg:'#E6F1FB', fg:'#0C447C' },
];

export const NOTIFICATIONS = [
  { id:'n1', type:'warning', icon:'🏆', text:'Priya S. overtook you on the branch leaderboard!', time:'2 min ago' },
  { id:'n2', type:'success', icon:'✅', text:'Your "Walk to class" task was verified successfully.', time:'1 hr ago' },
  { id:'n3', type:'danger',  icon:'⚠️', text:'Suspicious activity flagged on a recent submission — review pending.', time:'3 hr ago' },
  { id:'n4', type:'success', icon:'🌱', text:'You earned 30 pts for Segregate waste!', time:'5 hr ago' },
  { id:'n5', type:'info',    icon:'📢', text:'New task added: Carry reusable lunchbox (+15 pts).', time:'Yesterday' },
];
