import { Card } from '@/components/ui/card'

export function LoadingState() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-muted rounded-lg animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-8 w-16 bg-muted rounded-lg animate-pulse"></div>
              <div className="h-3 w-32 bg-muted rounded-lg animate-pulse"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
