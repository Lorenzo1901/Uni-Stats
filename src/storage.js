let fs, path, os;
try {
  if (typeof window !== 'undefined' && window.require) {
    fs = window.require('fs');
    path = window.require('path');
    os = window.require('os');
  }
} catch (e) {
  console.error("Failed to load node modules", e);
}

const getStoragePath = () => {
  if (!os) return null;
  return path.join(os.homedir(), '.config', 'tmpvite', 'uni_stats_data.json');
};

const customStorage = {
  data: null,
  load() {
    if (this.data) return this.data;
    const p = getStoragePath();
    if (p && fs && fs.existsSync(p)) {
      try {
        this.data = JSON.parse(fs.readFileSync(p, 'utf-8'));
      } catch (e) {
        this.data = {};
      }
    } else {
      this.data = {};
      // migrate from localStorage
      if (typeof localStorage !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('uniStats_')) {
            this.data[key] = localStorage.getItem(key);
          }
        }
      }
    }
    return this.data;
  },
  save() {
    const p = getStoragePath();
    if (p && fs) {
      try {
        // ensure dir exists
        const dir = path.dirname(p);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(p, JSON.stringify(this.data, null, 2));
      } catch (e) {
        console.error("Failed to save data", e);
      }
    }
  },
  getItem(key) {
    this.load();
    return this.data[key] !== undefined ? this.data[key] : null;
  },
  setItem(key, value) {
    this.load();
    this.data[key] = value;
    this.save();
    // Also save to localStorage as fallback
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }
};

export default customStorage;
