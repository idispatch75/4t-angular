angular.module( 'services.title', [])

.factory 'titleService', ( $document ) ->
  suffix = title = ""

  {
    setSuffix: ( s ) ->
      suffix = s

    getSuffix: () ->
      suffix

    setTitle: ( t ) ->
      if suffix isnt ""
        title = t + suffix
      else
        title = t

      $document.prop 'title', title

    getTitle: () ->
      $document.prop 'title'
  }

