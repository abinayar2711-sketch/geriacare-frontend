module.exports = {
  hooks: {
    readPackage(pkg) {
      pkg.dependencies = pkg.dependencies || {};
      pkg.dependencies['@supabase/supabase-js'] = '^2.39.7';
      return pkg;
    }
  }
};
