package presence.stories;

import com.palantir.docker.compose.DockerComposeRule;
import com.palantir.docker.compose.configuration.ShutdownStrategy;
import com.palantir.docker.compose.connection.waiting.HealthChecks;
import net.serenitybdd.junit.runners.SerenityRunner;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.abilities.BrowseTheWeb;
import net.serenitybdd.screenplay.actions.Open;
import net.serenitybdd.screenplay.questions.Text;
import net.serenitybdd.screenplay.targets.Target;
import net.thucydides.core.annotations.Managed;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;

import static net.serenitybdd.screenplay.EventualConsequence.eventually;
import static net.serenitybdd.screenplay.GivenWhenThen.givenThat;
import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.GivenWhenThen.then;
import static org.hamcrest.Matchers.is;

@RunWith(SerenityRunner.class)
public class CanOpenPage {
    private final Actor callum = Actor.named("callum");

    @Rule
    public DockerComposeRule composition = DockerComposeRule.builder()
        .file("docker-compose.yml")
        .waitingForService("selenium", HealthChecks.toRespondOverHttp(4444,
            port -> port.inFormat("http://$HOST:$EXTERNAL_PORT/wd/hub")))
        .shutdownStrategy(ShutdownStrategy.AGGRESSIVE)
        .build();

    @Managed(uniqueSession = true)
    public WebDriver callumsBrowser;

    @Before
    public void callumCanBrowseTheWeb() {
        callum.can(BrowseTheWeb.with(callumsBrowser));
    }

    @Test
    public void canOpenPage() {
        String targetUrl = "file:///site/index.html";
        givenThat(callum).attemptsTo(Open.url(targetUrl));

        Question<String> itIsChristmas = actor -> Text.of(Target
            .the("Is it Xmas?")
            .locatedBy("/html/body"))
            .viewedBy(actor)
            .asString();
        then(callum).should(eventually(seeThat(
            itIsChristmas, is("Hi")
        )));
    }
}
