import 'd2l-localize-behavior/d2l-localize-behavior.js';
window.D2L = window.D2L || {};
window.D2L.PolymerBehaviors = window.D2L.PolymerBehaviors || {};
window.D2L.PolymerBehaviors.ImageSelector = window.D2L.PolymerBehaviors.ImageSelector || {};

/*
* @polymerBehavior D2L.PolymerBehaviors.ImageSelector.LocalizeBehavior
*/
D2L.PolymerBehaviors.ImageSelector.LocalizeBehaviorImpl = {
	properties: {
		resources: {
			value: function() {
				return {
					'ar': {
						'images.noResults': 'لم يتم العثور على نتائج لـ {search}.',
						'search': 'بحث',
						'images.pleaseModify': 'يرجى إجراء تدقيق إملائي أو تعديل البحث.',
						'useThisImage': 'استخدام هذه الصورة',
						'upload': 'تحميل'
					},
					'en': {
						'images.noResults': 'No results found for {search}.',
						'search': 'Search',
						'images.pleaseModify': 'Please check your spelling or modify your search.',
						'useThisImage': 'Use this image',
						'upload': 'Upload'
					},
					'es': {
						'images.noResults': 'No se encontraron resultados para {search}.',
						'search': 'Buscar',
						'images.pleaseModify': 'Verifique la ortografía o modifique la búsqueda.',
						'useThisImage': 'Usar esta imagen',
						'upload': 'Cargar'
					},
					'fr': {
						'images.noResults': 'Aucun résultat trouvé pour {search}.',
						'search': 'Rechercher',
						'images.pleaseModify': 'Veuillez vérifier l\'orthographe ou modifier votre recherche.',
						'useThisImage': 'Utiliser cette image',
						'upload': 'Téléverser'
					},
					'ja': {
						'images.noResults': '{search}に対する結果はありません。',
						'search': '検索',
						'images.pleaseModify': 'スペルに誤りがないか確認してください。または検索する内容を変更してください。',
						'useThisImage': 'このイメージを使用',
						'upload': 'アップロード'
					},
					'ko': {
						'images.noResults': '{search}에 대한 검색 결과가 없습니다.',
						'search': '검색',
						'images.pleaseModify': '철자를 확인하거나 검색 내용을 수정해 보십시오.',
						'useThisImage': '이 이미지 사용',
						'upload': '업로드'
					},
					'nl': {
						'images.noResults': 'Geen resultaten gevonden voor {search}.',
						'search': 'Zoeken',
						'images.pleaseModify': 'Controleer de spelling of wijzig uw zoekopdracht.',
						'useThisImage': 'Deze afbeelding gebruiken',
						'upload': 'Uploaden'
					},
					'pt': {
						'images.noResults': 'Nenhum resultado encontrado para {search}.',
						'search': 'Pesquisar',
						'images.pleaseModify': 'Verifique a ortografia ou modifique a pesquisa.',
						'useThisImage': 'Usar esta imagem',
						'upload': 'Carregar'
					},
					'sv': {
						'images.noResults': 'Inga sökresultat för {search}.',
						'search': 'Sökning',
						'images.pleaseModify': 'Kontrollera stavningen eller ändra sökningen.',
						'useThisImage': 'Använd bild',
						'upload': 'Ladda upp'
					},
					'tr': {
						'images.noResults': '{search} için hiçbir sonuç bulunamadı.',
						'search': 'Ara',
						'images.pleaseModify': 'Lütfen yazım hatası yapıp yapmadığınızı kontrol edin veya aramanızı değiştirin.',
						'useThisImage': 'Bu görüntüyü kullan',
						'upload': 'Yükle'
					},
					'zh': {
						'images.noResults': '未找到 {search} 的结果。',
						'search': '搜索',
						'images.pleaseModify': '请检查您的拼写或修改搜索。',
						'useThisImage': '使用此图像',
						'upload': '上传'
					},
					'zh-tw': {
						'images.noResults': '找不到 {search} 的搜尋結果。',
						'search': '搜尋',
						'images.pleaseModify': '請檢查拼字或修改搜尋。',
						'useThisImage': '使用此影像',
						'upload': '上傳'
					}
				};
			}
		}
	}
};

/* @polymerBehavior D2L.PolymerBehaviors.ImageSelector.LocalizeBehavior */
D2L.PolymerBehaviors.ImageSelector.LocalizeBehavior = [
	D2L.PolymerBehaviors.LocalizeBehavior,
	D2L.PolymerBehaviors.ImageSelector.LocalizeBehaviorImpl
];
