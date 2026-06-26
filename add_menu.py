import re

with open("src/app/erp/layout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Video to lucide-react imports
content = re.sub(r'Bell, Wallet\n', r'Bell, Wallet, Video\n', content)

# 2. Add 'E-Konsultasiya' to menuNames array
content = re.sub(r"'E-Ticarət',", r"'E-Ticarət', 'E-Konsultasiya',", content)

# 3. Add the menu object after E-Ticarət
ecommerce_menu = r"""    {
      name: t('menu_ecommerce'),
      icon: <Globe size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      isPro: true,
      subItems: [
        { name: t('sub_in_orders'), path: '/erp/eticaret/pro' },
        { name: t('sub_settings'), path: '/erp/eticaret/pro' }
      ]
    },"""

econsult_menu = r"""    {
      name: 'E-Konsultasiya',
      icon: <Video size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      isPro: true,
      path: 'https://nitrocalls.site',
      subItems: []
    },"""

content = content.replace(ecommerce_menu, ecommerce_menu + "\n" + econsult_menu)

# 4. Update the render logic for external links
link_logic = r"""            if (!hasSubItems && menu.path) {
              return (
                <div key={menu.name} style={{ marginBottom: '0.25rem' }}>
                  <Link
                    href={menu.path}"""

new_link_logic = r"""            if (!hasSubItems && menu.path) {
              const isExternal = menu.path.startsWith('http');
              const LinkComponent = isExternal ? 'a' : Link;
              const linkProps = isExternal ? { href: menu.path, target: "_blank", rel: "noopener noreferrer" } : { href: menu.path };
              
              return (
                <div key={menu.name} style={{ marginBottom: '0.25rem' }}>
                  <LinkComponent
                    {...linkProps}"""

content = content.replace(link_logic, new_link_logic)

# 5. Fix the closing tag of Link
close_link = r"""                  </Link>
                  {menu.separatorAfter && ("""

new_close_link = r"""                  </LinkComponent>
                  {menu.separatorAfter && ("""

content = content.replace(close_link, new_close_link)

with open("src/app/erp/layout.tsx", "w", encoding="utf-8") as f:
    f.write(content)

