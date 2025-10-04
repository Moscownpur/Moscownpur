import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const ShadCNTest: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-between items-center">
            <div></div>
            <Button 
              onClick={toggleTheme}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isDark ? '☀️' : '🌙'} {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
          <h1 className="text-4xl font-bold text-foreground">ShadCN UI Test Page</h1>
          <p className="text-muted-foreground text-lg">
            Testing ShadCN components with CSS variables and oklch colors
          </p>
        </div>

        {/* Button Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Button Components</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🚀</Button>
          </div>
        </section>

        {/* Card Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Card Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>
                  This is a basic card component with default styling.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Card content goes here. This demonstrates the card component with proper theming.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Primary Card</CardTitle>
                <CardDescription>
                  This card uses primary colors and styling.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  This card demonstrates the primary color scheme with proper contrast.
                </p>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm">Confirm</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accent Card</CardTitle>
                <CardDescription>
                  This card shows accent colors and different styling.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The accent colors should be properly themed according to your CSS variables.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Learn More</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Color Palette Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Color Palette Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 bg-background border border-border rounded-lg flex items-center justify-center">
                <span className="text-foreground text-sm">Background</span>
              </div>
              <p className="text-xs text-muted-foreground">Background</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-sm">Primary</span>
              </div>
              <p className="text-xs text-muted-foreground">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground text-sm">Secondary</span>
              </div>
              <p className="text-xs text-muted-foreground">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Muted</span>
              </div>
              <p className="text-xs text-muted-foreground">Muted</p>
            </div>
          </div>
        </section>

        {/* Theme Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Theme Test</h2>
          <Card>
            <CardHeader>
              <CardTitle>Current Theme Variables</CardTitle>
              <CardDescription>
                These colors change dynamically when you toggle the theme. Current mode: <span className="font-semibold text-primary">{isDark ? 'Dark' : 'Light'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-foreground"><strong>Background:</strong> <span className="text-muted-foreground">var(--background)</span></p>
                <p className="text-foreground"><strong>Foreground:</strong> <span className="text-muted-foreground">var(--foreground)</span></p>
                <p className="text-foreground"><strong>Primary:</strong> <span className="text-muted-foreground">var(--primary)</span></p>
                <p className="text-foreground"><strong>Border:</strong> <span className="text-muted-foreground">var(--border)</span></p>
                <p className="text-foreground"><strong>Ring:</strong> <span className="text-muted-foreground">var(--ring)</span></p>
                <p className="text-foreground"><strong>Accent:</strong> <span className="text-muted-foreground">var(--accent)</span></p>
                <p className="text-foreground"><strong>Muted:</strong> <span className="text-muted-foreground">var(--muted)</span></p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Status */}
        <section className="text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-primary">ShadCN Setup Complete</h3>
                <p className="text-muted-foreground">
                  All components are working with CSS variables and oklch color format.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your existing pages should continue to work normally.
                </p>
                <div className="mt-4 p-4 bg-accent rounded-lg">
                  <p className="text-accent-foreground text-sm">
                    <strong>Note:</strong> https://tweakcn.com/themes/cmgbs9vf8000g04jm4b0uge5z.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ShadCNTest;
